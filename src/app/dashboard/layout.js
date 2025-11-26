"use client";
import { useState } from "react";

export default function DashboardLayout({ children }) {
    // null = home page (friends list)
    // any server ID = show text channels
    const [selectedServer, setSelectedServer] = useState(null);

    // Placeholder Servers
    const servers = [
        { id: "server1", label: "S1" },
        { id: "server2", label: "S2" },
    ];

    // Placeholder Channels
    const channels = [
        { id: "general", name: "#general" },
        { id: "chat", name: "#chat" },
        { id: "random", name: "#random" },
    ];

    return (
        <div
            style = {{
                height: "100vh",
                width: "100vw",
                display: "flex",
                overflow: "hidden",
            }}
        >
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
                    gap: "16px",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                }} 
            >
                {/* Home Icon */}
                <div
                    onClick={() => setSelectedServer(null)}
                    style = {{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "20px",
                        cursor: "pointer",
                    }}
                >
                    🏠
                </div>
                {/* Server Icons */}
                {servers.map((server) => (
                    <div
                        key = {server.id}
                        onClick={() => setSelectedServer(server.id)}
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #7c3aed, #4338ca)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "18px",
                            cursor: "pointer",
                        }}
                    >
                        {server.label}
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
                        <h2 style={{marginBottom: "20px", fontSize: "20px"}}>Channels</h2>

                        {channels.map((channel) => (
                            <div
                                key={channel.id}
                                style={{
                                    padding: "10px",
                                    borderRadius: "8px",
                                    marginBottom: "6px",
                                    cursor: "pointer",
                                    transition: "background 0.2s, transform 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                                    e.currentTarget.style.transform = "scale(1.02)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            >
                                {channel.name}
                            </div>
                        ))}
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