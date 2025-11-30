"use client";
import { useState, useEffect } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { getContracts } from "@/lib/contracts";
import DirectMessages from "./DirectMessages.jsx";  // DM panel
import AddFriend from "./AddFriend.jsx";            // Add Friend modal

export default function DashboardLayout({ children }) {
  const { account, signer, isConnected } = useWeb3();
  const [selectedServer, setSelectedServer] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFriends] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [tooltip, setToolTip] = useState({ show: false, text: "", x: 0, y: 0 });
  const [username, setUsername] = useState("");

  // Fetch username from blockchain
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

  // Load friends list from local storage
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

  // Adding new friend
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

  // Show and Hide Tooltip
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

  // Main UI Layout
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

      {/* Username + Wallet Address */}
      <div
        style={{
          padding: "12px 20px",
          background: "rgba(0, 0, 0, 0.4)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
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

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}></div>

      {/* Sidebar + Friend/Channel Panel + Chat View */}
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          overflow: "hidden",
        }}
      >

        {/* Tooltip for Server Icons and Buttons */}
        {tooltip.show && (
          <div
            style={{
              position: "fixed",
              top: tooltip.y,
              left: tooltip.x,
              transform: "translateY(-50%)",
              background: "rgba(0, 0, 0, 0.8)",
              padding: "6px 10px",
              borderRadius: "6px",
              color: "white",
              fontSize: "14px",
              whiteSpace: "nowrap",
              zIndex: 50,
              pointerEvents: "none",
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

        {/* Left Sidebar -- Home + Servers */}
        <div
          style={{
            width: "80px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(2px)",
            padding: "12px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            position: "relative",
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "20px",
              cursor: "pointer",
              position: "relative",
              zIndex: 1000,
              transition: "0.2s",
              background:
                selectedServer === null && !selectedFriend
                  ? "linear-gradient(135deg, #8b5cf6, #3b82f6)"
                  : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              transform:
                selectedServer === null && !selectedFriend
                  ? "scale(1.15)"
                  : "scale(1)",
              boxShadow:
                selectedServer === null && !selectedFriend
                  ? "0 0 10px rgba(255, 255, 255, 0.5)"
                  : "none",
            }}
          >
            {/* Sidebar Selection Indicator */}
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
            onClick={() => alert("TODO: Create Server Modal")}
            onMouseEnter={(e) => showTooltip("Create Server", e)}
            onMouseLeave={hideTooltip}
            style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                color: "white",
                fontSize: "28px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                transition: "0.2s",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
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
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
                cursor: "pointer",
                position: "relative",
                zIndex: 1000,
                transition: "0.2s",
                background:
                  selectedServer === server.id
                    ? "linear-gradient(135deg, #8b5cf6, #3b82f6)"
                    : "linear-gradient(135deg, #7c3aed, #4338ca)",
                transform:
                  selectedServer === server.id ? "scale(1.15)" : "scale(1.0)",
                boxShadow:
                  selectedServer === server.id
                    ? "0 0 10px rgba(255, 255, 255, 0.5)"
                    : "none",
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

              {/* Unread Messages Badge */}
              {server.unread > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    minWidth: "20px",
                    height: "20px",
                    background: "red",
                    borderRadius: "50%",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {server.unread}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Friends or Channels List */}
        <div
          style={{
            width: "260px",
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(4px)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
            color: "white",
          }}
        >
          {/* Show Friends List */}
          {selectedServer === null && (
            <>
              <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>
                Friends
              </h2>

              {/* Add Friend Button */}
              <button
                onClick={() => setShowAddFriend(true)}
                style={{
                  marginBottom: "20px",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Add Friend
              </button>

              {/* DM List */}
              {friends.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    opacity: 0.7,
                    marginTop: "20px",
                  }}
                >
                  No friends yet. Add someone to start chatting!
                </div>
              ) : (
                <div style={{ color: "white", opacity: 0.8 }}>
                  {friends.map((friend) => (
                    <div
                      key={friend.address}
                      onClick={() => setSelectedFriend(friend)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        cursor: "pointer",
                        background:
                          selectedFriend?.address === friend.address
                            ? "rgba(255, 255, 255, 0.2)"
                            : "transparent",
                        transition: "0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.15)")
                      }
                      onMouseLeave={(e) => {
                        if (selectedFriend?.address !== friend.address) {
                          e.currentTarget.style.background = "transparent";
                        }
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
                  ))}
                </div>
              )}
            </>
          )}

          {/* Show Channels List */}
          {selectedServer !== null && (
            <>
              <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>
                Channels
              </h2>

              {/* Add Text Channel Button */}
              <div
                onClick={() => alert("TODO: Create Channel Modal")}
                style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    marginBottom: "12px",
                    cursor: "pointer",
                    color: "rgba(255, 255, 255, 0.7)",
                    background: "rgba(255, 255, 255, 0.05)",
                    fontSize: "14px",
                    width: "fit-content",
                    transition: "0.2s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
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
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      position: "relative",
                      background: isActive
                        ? "rgba(255,255,255,0.25)"
                        : "transparent",
                      transform: isActive ? "scale(1.02)" : "scale(1)",
                      transition: "0.2s",
                    }}
                  >
                    {isActive && (
                      <div
                        style={{
                          width: "6px",
                          height: "100%",
                          background: "white",
                          borderRadius: "6px",
                          position: "absolute",
                          left: "-12px",
                        }}
                      />
                    )}
                    {channel.name}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Right Panel -- DM Panel or Main Page Content */}
        <main style={{ flex: 1, background: "rgba(0, 0, 0, 0.25)" }}>
          {selectedFriend ? (
            <DirectMessages friend={selectedFriend} />
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
