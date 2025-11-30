"use client";
import { useState, useEffect } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { getContracts } from "@/lib/contracts";
import DirectMessages from "./DirectMessages.jsx";
import ServerMessages from "./ServerMessages.jsx";
import AddFriend from "./AddFriend.jsx";
import AddServer from "./AddServer.jsx";
import AddChannel from "./AddChannel.jsx";

export default function DashboardLayout({ children }) {
  const { account, signer, isConnected } = useWeb3();
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFriends] = useState([]);
  const [servers, setServers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showAddServer, setShowAddServer] = useState(false);
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [tooltip, setToolTip] = useState({ show: false, text: "", x: 0, y: 0 });
  const [username, setUsername] = useState("");
  const [isServerOwner, setIsServerOwner] = useState(false);

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

  useEffect(() => {
    if (account && typeof window !== "undefined") {
      const key = `friends_${account.toLowerCase()}`;
      const saved = localStorage.getItem(key);
      setFriends(saved ? JSON.parse(saved) : []);
    }
  }, [account]);

  useEffect(() => {
    async function loadServers() {
      if (isConnected && signer && account) {
        try {
          const contracts = getContracts(signer);
          const serverCount = await contracts.server.getServerCount();

          const userServers = [];
          for (let i = 0; i < serverCount; i++) {
            const isMember = await contracts.server.isMember(i, account);
            if (isMember) {
              const serverData = await contracts.server.getServer(i);
              userServers.push({
                id: i,
                name: serverData[0],
                owner: serverData[1],
                memberCount: serverData[2].length,
              });
            }
          }

          setServers(userServers);
        } catch (err) {
          console.error("Error loading servers:", err);
        }
      }
    }
    loadServers();
  }, [isConnected, signer, account]);

  useEffect(() => {
    async function loadChannels() {
      if (selectedServer && isConnected && signer) {
        try {
          setChannels([]);
          setSelectedChannel(null);

          const contracts = getContracts(signer);
          const channelData = await contracts.server.getAllChannels(
            selectedServer.id
          );

          const channelList = [];
          for (let i = 0; i < channelData[0].length; i++) {
            channelList.push({
              id: Number(channelData[0][i]),
              name: channelData[1][i],
            });
          }

          setChannels(channelList);

          if (channelList.length > 0) {
            setSelectedChannel(channelList[0]);
          }

          setIsServerOwner(
            selectedServer.owner.toLowerCase() === account.toLowerCase()
          );
        } catch (err) {
          console.error("Error loading channels:", err);
          setChannels([]);
          setSelectedChannel(null);
        }
      } else {
        setChannels([]);
        setSelectedChannel(null);
      }
    }
    loadChannels();
  }, [selectedServer, isConnected, signer, account]);

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

  const handleServerCreated = (server) => {
    setServers([...servers, server]);
    setShowAddServer(false);
  };

  const handleServerJoined = (server) => {
    if (!servers.find((s) => s.id === server.id)) {
      setServers([...servers, server]);
    }
    setShowAddServer(false);
  };

  const handleChannelAdded = (channel) => {
    setChannels([...channels, channel]);
    setShowAddChannel(false);
    setSelectedChannel(channel);
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
      {/* Top Header */}
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

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Tooltips */}
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

        {/* Modals */}
        {showAddFriend && (
          <AddFriend
            onFriendAdded={handleFriendAdded}
            onClose={() => setShowAddFriend(false)}
          />
        )}

        {showAddServer && (
          <AddServer
            onServerCreated={handleServerCreated}
            onServerJoined={handleServerJoined}
            onClose={() => setShowAddServer(false)}
          />
        )}

        {showAddChannel && selectedServer && (
          <AddChannel
            serverId={selectedServer.id}
            onChannelAdded={handleChannelAdded}
            onClose={() => setShowAddChannel(false)}
          />
        )}

        {/* Server Sidebar */}
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
            overflowY: "auto",
          }}
        >
          {/* Home Button */}
          <div
            onClick={() => {
              setSelectedServer(null);
              setSelectedChannel(null);
              setSelectedFriend(null);
              setChannels([]);
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
            H
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "28px",
              cursor: "pointer",
              background: "linear-gradient(135deg, #10b981, #059669)",
              transition: "0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            +
          </div>

          {/* User's Servers */}
          {servers.map((server) => (
            <div
              key={server.id}
              onClick={() => {
                setSelectedServer(server);
                setSelectedChannel(null);
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
                fontSize: "16px",
                cursor: "pointer",
                position: "relative",
                transition: "0.2s",
                background:
                  selectedServer?.id === server.id
                    ? "linear-gradient(135deg, #8b5cf6, #3b82f6)"
                    : "linear-gradient(135deg, #7c3aed, #4338ca)",
                transform:
                  selectedServer?.id === server.id
                    ? "scale(1.15)"
                    : "scale(1.0)",
                boxShadow:
                  selectedServer?.id === server.id
                    ? "0 0 10px rgba(255, 255, 255, 0.5)"
                    : "none",
              }}
            >
              {selectedServer?.id === server.id && (
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
              {server.name.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>

        {/* Channel/Friend Sidebar */}
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
          {/* Friends View */}
          {selectedServer === null && (
            <>
              <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>
                Friends
              </h2>

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

          {/* Server Channels View */}
          {selectedServer !== null && (
            <>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
                  {selectedServer.name}
                </h2>
                <p style={{ fontSize: "12px", opacity: 0.7 }}>
                  Server ID: {selectedServer.id}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <h3 style={{ fontSize: "14px", opacity: 0.8 }}>CHANNELS</h3>
                {isServerOwner && (
                  <button
                    onClick={() => setShowAddChannel(true)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      background: "rgba(139, 92, 246, 0.3)",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                    title="Create Channel"
                  >
                    +
                  </button>
                )}
              </div>

              {channels.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    opacity: 0.7,
                    marginTop: "20px",
                  }}
                >
                  Loading channels...
                </div>
              ) : (
                channels.map((channel) => {
                  const isActive = selectedChannel?.id === channel.id;
                  return (
                    <div
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel)}
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
                      #{channel.name}
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>

        {/* Main Content Area */}
        <main style={{ flex: 1, background: "rgba(0, 0, 0, 0.25)" }}>
          {selectedFriend ? (
            <DirectMessages friend={selectedFriend} />
          ) : selectedServer &&
            selectedChannel &&
            selectedChannel.id !== undefined ? (
            <ServerMessages server={selectedServer} channel={selectedChannel} />
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}