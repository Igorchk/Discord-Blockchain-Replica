"use client";
import { useState, useEffect, useRef } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { MessageContract, getContracts } from "@/lib/contracts";
import { ethers } from "ethers";

export default function ServerMessages({ server, channel }) {
  const { account, signer, isConnected } = useWeb3();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [usernames, setUsernames] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUsername = async (address) => {
    if (usernames[address]) {
      return usernames[address];
    }

    try {
      const contracts = getContracts(signer);
      const username = await contracts.user.getUsername(address);

      setUsernames((prev) => ({ ...prev, [address]: username }));

      return username;
    } catch (err) {
      console.error("Error fetching username for", address, err);
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (
      isConnected &&
      account &&
      server &&
      channel &&
      channel.id !== undefined
    ) {
      loadMessages();
    }
  }, [server, channel, account, isConnected]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const messageContract = new MessageContract(signer);

      const batches = await messageContract.getBatches(server.id, channel.id);

      if (batches.length === 0) {
        setMessages([]);
        setLoading(false);
        return;
      }

      let allMessages = [];
      for (const batch of batches) {
        try {
          const response = await fetch(
            `http://127.0.0.1:8080/ipfs/${batch.cid}`
          );
          const batchData = await response.json();

          const messagesFromBatch = Array.isArray(batchData)
            ? batchData
            : batchData.messages || [];

          allMessages.push(...messagesFromBatch);
        } catch (err) {
          console.error("Error fetching IPFS batch:", err);
        }
      }

      allMessages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      setMessages(allMessages);

      const uniqueSenders = [
        ...new Set(allMessages.map((msg) => msg.from).filter(Boolean)),
      ];
      for (const sender of uniqueSenders) {
        if (
          !usernames[sender] &&
          sender.toLowerCase() !== account.toLowerCase()
        ) {
          await fetchUsername(sender);
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      !server ||
      !channel ||
      !isConnected ||
      !account ||
      channel.id === undefined
    )
      return;

    const interval = setInterval(() => {
      loadMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [server, channel, account, isConnected, signer]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !isConnected || sending) return;

    try {
      setSending(true);

      const messageObj = {
        from: account,
        content: newMessage,
        timestamp: Date.now(),
      };

      const batch = [messageObj];
      const batchJSON = JSON.stringify(batch);

      const ipfsResponse = await fetch("http://127.0.0.1:5001/api/v0/add", {
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append(
            "file",
            new Blob([batchJSON], { type: "application/json" })
          );
          return formData;
        })(),
      });

      const ipfsResult = await ipfsResponse.json();
      const cid = ipfsResult.Hash;

      const batchBuffer = new TextEncoder().encode(batchJSON);
      const batchHash = ethers.keccak256(batchBuffer);

      const messageContract = new MessageContract(signer);
      await messageContract.storeBatch(
        server.id,
        channel.id,
        cid,
        batchHash,
        ""
      );

      setMessages([...messages, messageObj]);
      setNewMessage("");

      setTimeout(() => loadMessages(), 2000);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message: " + error.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isConnected) {
    return (
      <div style={{ padding: "32px", color: "white" }}>
        <h2>Please connect your wallet to send messages</h2>
      </div>
    );
  }

  if (!channel || channel.id === undefined) {
    return (
      <div style={{ padding: "32px", color: "white" }}>
        <h2>Loading channel...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          background: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
          {server.name} / #{channel.name}
        </h2>
        <p style={{ fontSize: "12px", opacity: 0.7 }}>
          {server.memberCount || 0} members
        </p>
      </div>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", opacity: 0.7 }}>
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", opacity: 0.7 }}>
            No messages yet. Start the conversation in #{channel.name}!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage =
              msg.from && msg.from.toLowerCase() === account.toLowerCase();

            const displayName = isOwnMessage
              ? "You"
              : usernames[msg.from] ||
                `${msg.from?.slice(0, 6)}...${msg.from?.slice(-4)}` ||
                "Unknown";

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: isOwnMessage
                      ? "linear-gradient(135deg, #8b5cf6, #3b82f6)"
                      : "rgba(255, 255, 255, 0.1)",
                    wordWrap: "break-word",
                  }}
                >
                  {!isOwnMessage && (
                    <div
                      style={{
                        fontSize: "11px",
                        opacity: 0.8,
                        marginBottom: "4px",
                        fontWeight: "bold",
                      }}
                    >
                      {displayName}
                    </div>
                  )}
                  <div style={{ fontSize: "14px" }}>
                    {msg.content || msg.text}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      opacity: 0.7,
                      marginTop: "4px",
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: "20px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          background: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message #${channel.name}...`}
            disabled={sending}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              fontSize: "14px",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              background:
                sending || !newMessage.trim()
                  ? "rgba(139, 92, 246, 0.5)"
                  : "linear-gradient(135deg, #8b5cf6, #3b82f6)",
              color: "white",
              border: "none",
              cursor: sending || !newMessage.trim() ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}