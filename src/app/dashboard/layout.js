"use client";
import { useState } from "react";

export default function DashboardLayout({ children }) {
    // null = home page (friends list)
    // any server ID = show text channels
    const [selectedServer, setSelectedServer] = useState(null);
    const [activeChannel, setActiveChannel] = useState(null);
    const [tooltip, setToolTip] = useState({show: false, text: "", x: 0, y: 0});

    // Placeholder Servers
    const [servers, setServers] = useState([
        { id: "server1", label: "S1", name: "Server One", members: ["alice", "bob"] },
        { id: "server2", label: "S2", name: "Server Two", members: ["alice"] },
    ]);

    // Placeholder Channels
    const [channels, setChannels] = useState({
        server1: [
            { id: "general", name: "#general" },
            { id: "chat", name: "#chat" },
            { id: "random", name: "#random" }
        ],
        server2: [{ id: "general", name: "#general" }]
    });

    // Modal State
    const [showCreateServer, setShowCreateServer] = useState(false);
    const [newServerName, setNewServerName] = useState("");

    const [showCreateChannel, setShowCreateChannel] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");

    // Show tooltip (text when hovering over server)
    const showTooltip = (text, event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setToolTip({
            show: true,
            text,
            x: rect.right + 10,
            y: rect.top + rect.height / 2,
        });
    };

    // Hide tooltip
    const hideTooltip = () => setToolTip({show: false, text: "", x: 0, y: 0});

    // Create Server
    const handleCreateServer = () => {
        if(!newServerName.trim()) return;

        const newID = "server" + (servers.length + 1);
        setServers([
            ...servers,
            {
                id: newID,
                label: "S" + (servers.length + 1),
                name: newServerName,
                members: ["alice"]
            }
        ]);
        setChannels({...channels, [newID]: [{id: "general", name: "#general"}]});
        setNewServerName("");
        setShowCreateServer(false);
    };

    // Create Channel
    const handleCreateChannel = () => {
        if(!newChannelName.trim() || !selectedServer) return;

        const serverCh = channels[selectedServer] || [];
        setChannels({
            ...channels,
            [selectedServer]: [
                ...serverCh,
                {
                    id: newChannelName.toLowerCase().replace(/\s+/g, "-"),
                    name: "#" + newChannelName
                }
            ]
        });

        setNewChannelName("");
        setShowCreateChannel(false);
    };

    return (
        <div
            style = {{
                height: "100vh",
                width: "100vw",
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

            {/* Server Bar */}
            <div
                style = {{
                    width: "80px",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(2px)",
                    padding: "12px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    height: "100%",
                    gap: "16px",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                    position: "relative",
                }} 
            >

                {/* Home Icon */}
                <div
                    onClick={() => {
                        setSelectedServer(null);
                        setActiveChannel(null);
                    }}
                    onMouseEnter={(e) => showTooltip("Home", e)}
                    onMouseLeave={hideTooltip}
                    style = {{
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

                        // Active Home Icon
                        background:
                            selectedServer === null
                                ? "linear-gradient(135deg, #8b5cf6, #3b82f6)"
                                : "linear-gradient(135deg, #3b82f6, #8b5cf6)",

                        transform: selectedServer === null ? "scale(1.15)" : "scale(1)",
                        boxShadow:
                            selectedServer === null
                                ? "0 0 10px rgba(255, 255, 255, 0.5)"
                                : "none",
                    }}
                >

                    {/* White Active Pill Indicator */}
                    {selectedServer === null && (
                        <div
                            style={{
                                width: "6px",
                                height: "30px",
                                background: "white",
                                borderRadius: "6px",
                                position: "absolute",
                                left: "-12px",
                            }}
                        >
                        </div>
                    )}
                    🏠
                </div>

                {/* Add Server Button */}
                <div
                    onClick={() => setShowCreateServer(true)}
                    onMouseEnter={(e) => showTooltip("Create Server", e)}
                    onMouseLeave={hideTooltip}
                    style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        color: "white",
                        fontSize: "28px",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        marginBottom: "12px",
                        transition: "0.2s",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    }}
                >
                    +
                </div>

                {/* Server Icons */}
                {servers.map((server) => (
                    <div
                        key = {server.id}
                        onClick={() => {
                            setSelectedServer(server.id);
                            setActiveChannel(null);
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

                            // Active Server Styling
                            background: selectedServer === server.id
                                ? "linear-gradient(135deg, #8b5cf6, #3b82f6)"
                                : "linear-gradient(135deg, #7c3aed, #4338ca)",

                            transform: selectedServer === server.id ? "scale(1.15)" : "scale(1.0)",
                            boxShadow: selectedServer === server.id
                                ? "0 0 10px rgba(255, 255, 255, 0.5)"
                                : "none",
                        }}
                    >

                        {/* White Active Pill Indicator */}
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
                            >
                            </div>
                        )}
                        {server.label}

                        {/* Unread Badge */}
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

            {/* Friend List OR Channel List*/}
            <div
                style = {{
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
                        <h2 style={{marginBottom: "20px", fontSize: "20px"}}>Friends</h2>

                        <button style={{marginBottom: "20px"}}>Add Friend</button>

                        <div style={{color: "white", opacity: 0.8}}>
                            <p className="mb-2">user#1234</p>
                            <p className="mb-2">user#5678</p>
                        </div>  
                    </>
                )}
                
                {/* Show Channel List */}
                {selectedServer !== null && (
                    <>
                        <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>Channels</h2>

                        {/* Add Channel Button */}
                        <div
                            onClick={() => setShowCreateChannel(true)}
                            style={{
                                padding: "6px 10x",
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

                        {(channels[selectedServer] || []).map((channel) => {
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
                                    {/* White Pill Indicator */}
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

            {/* Main Chat Panel */}
            <main style={{flex: 1, background: "rgba(0, 0, 0, 0.25)"}}>
                {children}
            </main>
        </div>
    );
}