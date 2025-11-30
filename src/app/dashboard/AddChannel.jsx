"use client";
import { use, useState } from "react";

export default function AddChannel({ onChannelAdded, onClose }) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();

        if(!name.trim()) {
            setError("Please enter a channel name");
            return;
        }

        // For now channels are local only, contracts to be implemented later
        onChannelAdded({id: name.toLowerCase().replace(/\s+/g, "-"), name: '#${name}'});

        setLoading(false);
        setName("");
        onClose();
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    background: "rgba(30, 30, 30, 0.95)",
                    backdropFilter: "blur(10px)",
                    padding: "32px",
                    borderRadius: "16px",
                    width: "400px",
                    maxWidth: "90%",
                }}
            >
                <h2 style={{fontSize: "24px", marginBottom: "16px", color: "white"}}>
                    Add Channel
                </h2>

                <form onSubmit={handleAdd}>
                    <div style={{marginBottom: "16px"}}>
                        <label style={{display: "block", marginBottom: "8px", color: "white",}}>
                            Channel Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter channel name"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                background: "rgba(255, 255, 255, 0.1)",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                color: "white",
                                fontSize: "16px",
                            }}
                        />
                    </div>

                    {error && (
                        <div
                            style={{
                                marginBottom: "16px",
                                padding: "12px",
                                borderRadius: "8px",
                                background: "rgba(239, 68, 68, 0.2)",
                                border: "1px solid rgb(239, 68, 68)",
                                color: "rgb(252, 165, 165)",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <div style={{display: "flex", gap: "12px"}}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                background: loading
                                    ? "rgba(139, 92, 246, 0.5)"
                                    : "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                                color: "white",
                                border: "none",
                                cursor: loading ? "not-allowed" : "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            {loading ? "Adding..." : "Add Channel"}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                background: "rgba(255, 255, 255, 0.1)",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "bold",
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}