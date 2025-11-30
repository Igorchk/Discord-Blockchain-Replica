"use client";
import { useState } from "react";

export default function AddServer({ onCreate, onJoin, onClose }) {
  const [mode, setMode] = useState("create");   // "create" | "join"
  const [serverName, setServerName] = useState("");
  const [serverAddress, setServerAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create new server
  const handleCreate = (e) => {
    e.preventDefault();

    if (!serverName.trim()) {
      setError("Please enter a server name");
      return;
    }

    setLoading(true);
    setError("");

    // Will attach blockchain later
    onCreate(serverName);
    setLoading(false);
    onClose();
  };

  // Join existing server
  const handleJoin = (e) => {
    e.preventDefault();

    if (!serverAddress.trim()) {
      setError("Please enter a server address");
      return;
    }

    setLoading(true);
    setError("");

    // Will attach blockchain later
    onJoin(serverAddress);
    setLoading(false);
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
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "rgba(30,30,30,0.95)",
          backdropFilter: "blur(10px)",
          padding: "32px",
          borderRadius: "16px",
          width: "450px",
          maxWidth: "90%",
        }}
      >
        <h2 style={{ fontSize: "24px", color: "white", marginBottom: "20px" }}>
          {mode === "create" ? "Create Server" : "Join Server"}
        </h2>

        {/* Mode toggle buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <button
            onClick={() => setMode("create")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              background:
                mode === "create"
                  ? "linear-gradient(135deg,#8b5cf6,#3b82f6)"
                  : "rgba(255,255,255,0.1)",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Create
          </button>

          <button
            onClick={() => setMode("join")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              background:
                mode === "join"
                  ? "linear-gradient(135deg,#8b5cf6,#3b82f6)"
                  : "rgba(255,255,255,0.1)",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Join
          </button>
        </div>

        {/* Create Server Form */}
        {mode === "create" && (
          <form onSubmit={handleCreate}>
            <label style={{ color: "white" }}>Server Name</label>
            <input
              type="text"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder="Enter server name"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "8px",
                padding: "12px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                fontSize: "16px",
                marginBottom: "16px",
              }}
            />

            {error && (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(239,68,68,0.2)",
                  border: "1px solid rgb(239,68,68)",
                  color: "rgb(252,165,165)",
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  background:
                    loading
                      ? "rgba(139,92,246,0.5)"
                      : "linear-gradient(135deg,#8b5cf6,#3b82f6)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Create
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.1)",
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
        )}

        {/* Join Server Form */}
        {mode === "join" && (
          <form onSubmit={handleJoin}>
            <label style={{ color: "white" }}>Server Address</label>
            <input
              type="text"
              value={serverAddress}
              onChange={(e) => setServerAddress(e.target.value)}
              placeholder="Enter contract address"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "8px",
                padding: "12px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                fontSize: "16px",
                marginBottom: "16px",
              }}
            />

            {error && (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(239,68,68,0.2)",
                  border: "1px solid rgb(239,68,68)",
                  color: "rgb(252,165,165)",
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  background:
                    loading
                      ? "rgba(139,92,246,0.5)"
                      : "linear-gradient(135deg,#8b5cf6,#3b82f6)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Join
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.1)",
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
        )}
      </div>
    </div>
  );
}