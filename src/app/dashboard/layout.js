"use client";
import { useState, useEffect } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { getContracts } from "@/lib/contracts";
import DirectMessages from "./DirectMessages.jsx";  // DM panel
import AddFriend from "./AddFriend.jsx";            // Add Friend modal
import AddServer from "./AddServer.jsx";            // Add Server modal
import AddChannel from "./AddChannel.jsx";          // Add Channel modal

export default function DashboardLayout({ children }) {
  const { account, signer, isConnected } = useWeb3();
  const [selectedServer, setSelectedServer] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFriends] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [tooltip, setToolTip] = useState({ show: false, text: "", x: 0, y: 0 });
  const [username, setUsername] = useState("");
  const [showAddServer, setShowAddServer] = useState(false);
  const [showAddChannel, setShowAddChannel] = useState(false);

  // Fetch username
  useEffect(() => {
    async function fetchUsername() {
      if (isConnected && signer && account) {
        try {
          const contracts = getContracts(signer);
          const name = await contracts.user.getUsername(account);
          setUsername(name);
        } catch (err) {
          console.error("Error fetching username:", err);
        }
      }
    }
    fetchUsername();
  }, [isConnected, signer, account]);

  // Load friends list
  useEffect(() => {
    if (account && typeof window !== "undefined") {
      const key = `friends_${account.toLowerCase()}`;
      const saved = localStorage.getItem(key);
      setFriends(saved ? JSON.parse(saved) : []);
    }
  }, [account]);

  // Placeholder Servers
  const servers = [
    { id: "server1", label: "S1", name: "Server One", unread: 2 },
    { id: "server2", label: "S2", name: "Server Two", unread: 5 },
  ];

  // Placeholder Channels
  const channels = [
    { id: "general", name: "#general" },
    { id: "chat", name: "#chat" },
    { id: "random", name: "#random" },
  ];

  const handleFriendAdded = (friend) => {
    if (!friends.find((f) => f.address === friend.address)) {
      const newFriends = [...friends, friend];
      setFriends(newFriends);
      if (account && typeof window !== "undefined") {
        const key = `friends_${account.toLowerCase()}`;
        localStorage.setItem(key, JSON.stringify(newFriends));
      }
    }
  };

  const showTooltip = (text, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setToolTip({
      show: true,
      text,
      x: rect.right + 10,
      y: rect.top + rect.height / 2,
    });
  };

  const hideTooltip = () => setToolTip({ show: false, text: "", x: 0, y: 0 });

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        overflow: "hidden",
        flexDirection: "column",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          padding: "12px 20px",
          background: "rgba(0,0,0,0.4)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>
          {username || "Loading..."}
        </div>

        <div
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "12px",
            fontFamily: "monospace",
          }}
        >
          {account?.slice(0, 6)}...{account?.slice(-4)}
        </div>
      </div>

      {/* Layout Row */}
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Tooltip */}
        {tooltip.show && (
          <div
            style={{
              position: "fixed",
              top: tooltip.y,
              left: tooltip.x,
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.8)",
              padding: "6px 10px",
              borderRadius: "6px",
              color: "white",
              fontSize: "14px",
              whiteSpace: "nowrap",
              zIndex: 999,
            }}
          >
            {tooltip.text}
          </div>
        )}

        {/* Add Friend Modal */}
        {showAddFriend && (
          <AddFriend
            onFriendAdded={handleFriendAdded}
            onClose={() => setShowAddFriend(false)}
          />
        )}

        {/* Add Server Modal */}
        {showAddServer && (
          <AddServer
            onCreate={(name) => {
              console.log("Create server:", name);
              setShowAddServer(false);
            }}
            onJoin={(address) => {
              console.log("Join server:", address);
              setShowAddServer(false);
            }}
            onClose={() => setShowAddServer(false)}
          />
        )}

        {/* Add Channel Modal */}
        {showAddChannel && (
          <AddChannel
            onChannelAdded={(channel) => {
              console.log("New channel:", channel);
              setShowAddChannel(false);
            }}
            onClose={() => setShowAddChannel(false)}
          />
        )}

        {/* LEFT SIDEBAR */}
        <div
          style={{
            width: "80px",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(2px)",
            padding: "12px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          }}
        >
          {/* Home Button */}
          <div
            onClick={() => {
              setSelectedServer(null);
              setActiveChannel(null);
              setSelectedFriend(null);
            }}
            onMouseEnter={(e) => showTooltip("Home", e)}
            onMouseLeave={hideTooltip}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background:
                selectedServer === null && !selectedFriend
                  ? "linear-gradient(135deg,#8b5cf6,#3b82f6)"
                  : "linear-gradient(135deg,#3b82f6,#8b5cf6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              fontWeight: "bold",
              color: "white",
              fontSize: "20px",
              position: "relative",
            }}
          >
            {selectedServer === null && !selectedFriend && (
              <div
                style={{
                  width: "6px",
                  height: "30px",
                  background: "white",
                  borderRadius: "6px",
                  position: "absolute",
                  left: "-12px",
                }}
              />
            )}
            🏠
          </div>

          {/* Add Server Button */}
          <div
            onClick={() => setShowAddServer(true)}
            onMouseEnter={(e) => showTooltip("Add Server", e)}
            onMouseLeave={hideTooltip}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              fontSize: "28px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            +
          </div>

          {/* Server Icons */}
          {servers.map((server) => (
            <div
              key={server.id}
              onClick={() => {
                setSelectedServer(server.id);
                setActiveChannel(null);
                setSelectedFriend(null);
              }}
              onMouseEnter={(e) => showTooltip(server.name, e)}
              onMouseLeave={hideTooltip}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                background:
                  selectedServer === server.id
                    ? "linear-gradient(135deg,#8b5cf6,#3b82f6)"
                    : "linear-gradient(135deg,#7c3aed,#4338ca)",
                transform:
                  selectedServer === server.id ? "scale(1.15)" : "scale(1)",
                position: "relative",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {selectedServer === server.id && (
                <div
                  style={{
                    width: "6px",
                    height: "30px",
                    background: "white",
                    borderRadius: "6px",
                    position: "absolute",
                    left: "-12px",
                  }}
                />
              )}

              {server.label}

              {server.unread > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: "20px",
                    height: "20px",
                    background: "red",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  {server.unread}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show Friends or Channels List */}
        <div
          style={{
            width: "260px",
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            color: "white",
          }}
        >
          {/* Friend List */}
          {selectedServer === null && (
            <>
              <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>
                Friends
              </h2>

              <button
                onClick={() => setShowAddFriend(true)}
                style={{
                  padding: "10px",
                  marginBottom: "20px",
                  borderRadius: "6px",
                  background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Add Friend
              </button>

              {friends.length === 0 ? (
                <div style={{ opacity: 0.7 }}>No friends yet.</div>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend.address}
                    onClick={() => setSelectedFriend(friend)}
                    style={{
                      padding: "12px",
                      marginBottom: "8px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background:
                        selectedFriend?.address === friend.address
                          ? "rgba(255,255,255,0.2)"
                          : "transparent",
                      transition: "0.2s",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>
                      {friend.username}
                    </div>
                    <div style={{ fontSize: "11px", opacity: 0.7 }}>
                      {friend.address.slice(0, 6)}...
                      {friend.address.slice(-4)}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* Channel List */}
          {selectedServer !== null && (
            <>
              <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>
                Channels
              </h2>

              <div
                onClick={() => setShowAddChannel(true)}
                style={{
                  padding: "6px 10px",
                  marginBottom: "12px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.05)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.15)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color =
                    "rgba(255,255,255,0.7)";
                }}
              >
                + Add Channel
              </div>

              {channels.map((channel) => {
                const isActive = activeChannel === channel.id;
                return (
                  <div
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      marginBottom: "6px",
                      cursor: "pointer",
                      background: isActive
                        ? "rgba(255,255,255,0.25)"
                        : "transparent",
                    }}
                  >
                    {channel.name}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Main Chat or Children */}
        <main style={{ flex: 1, background: "rgba(0,0,0,0.25)" }}>
          {selectedFriend ? (
            <DirectMessages friend={selectedFriend} />
          ) : (
            children
          )}
        </main>

        {/* Right-side Members Panel */}
        {selectedServer && (
          <div
            style={{
              width: "220px",
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(6px)",
              padding: "20px",
              color: "white",
              borderLeft: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>
              Members
            </h2>

            {friends.length === 0 ? (
              <div style={{ opacity: 0.6 }}>No members yet.</div>
            ) : (
              friends.map((friend) => ( // replace with serverMembers[selectedServer].map(...) to pull from Server.sol contract
                <div
                  key={friend.address}
                  style={{
                    padding: "10px",
                    marginBottom: "8px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.08)",
                  }}
                >
                  {friend.username}
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>
                    {friend.address.slice(0, 6)}...
                    {friend.address.slice(-4)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}