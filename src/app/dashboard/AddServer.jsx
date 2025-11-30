"use client";
import { useState } from "react";
import { getContracts } from "@/lib/contracts";
import { useWeb3 } from "@/contexts/Web3Context";

export default function AddServer({
  onServerCreated,
  onServerJoined,
  onClose,
}) {
  const { signer } = useWeb3();
  const [mode, setMode] = useState("create");
  const [serverName, setServerName] = useState("");
  const [serverId, setServerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!serverName.trim()) {
      setError("Please enter a server name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const contracts = getContracts(signer);

      // Create server on blockchain
      const receipt = await contracts.server.createServer(serverName);

      // Get the server count to determine the new server's ID
      const serverCount = await contracts.server.getServerCount();
      const newServerId = serverCount - 1; // Server IDs start at 0

      // Get server details
      const serverData = await contracts.server.getServer(newServerId);

      const newServer = {
        id: newServerId,
        name: serverData[0], // name
        owner: serverData[1], // owner
        memberCount: serverData[2].length, // members array length
      };

      onServerCreated(newServer);
      setServerName("");
      onClose();
    } catch (err) {
      console.error("Error creating server:", err);
      setError("Failed to create server: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();

    if (!serverId.trim()) {
      setError("Please enter a server ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const contracts = getContracts(signer);
      const serverIdNum = parseInt(serverId);

      // Check if server exists
      const serverCount = await contracts.server.getServerCount();
      if (serverIdNum >= serverCount) {
        setError("Server does not exist");
        setLoading(false);
        return;
      }

      // Join server on blockchain
      await contracts.server.joinServer(serverIdNum);

      // Get server details
      const serverData = await contracts.server.getServer(serverIdNum);

      const joinedServer = {
        id: serverIdNum,
        name: serverData[0],
        owner: serverData[1],
        memberCount: serverData[2].length,
      };

      onServerJoined(joinedServer);
      setServerId("");
      onClose();
    } catch (err) {
      console.error("Error joining server:", err);
      setError("Failed to join server: " + err.message);
    } finally {
      setLoading(false);
    }
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
            onClick={() => {
              setMode("create");
              setError("");
            }}
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
            onClick={() => {
              setMode("join");
              setError("");
            }}
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
              placeholder="My Public Server"
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
                  background: loading
                    ? "rgba(139,92,246,0.5)"
                    : "linear-gradient(135deg,#8b5cf6,#3b82f6)",
                  color: "white",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
              >
                {loading ? "Creating..." : "Create Server"}
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
            <label style={{ color: "white" }}>Server ID</label>
            <input
              type="number"
              value={serverId}
              onChange={(e) => setServerId(e.target.value)}
              placeholder="0"
              disabled={loading}
              min="0"
              style={{
                width: "100%",
                marginTop: "8px",
                padding: "12px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                fontSize: "16px",
                marginBottom: "8px",
              }}
            />
            <p
              style={{
                fontSize: "12px",
                opacity: 0.7,
                color: "white",
                marginBottom: "16px",
              }}
            >
              Ask the server owner for the server ID
            </p>

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
                  background: loading
                    ? "rgba(139,92,246,0.5)"
                    : "linear-gradient(135deg,#8b5cf6,#3b82f6)",
                  color: "white",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
              >
                {loading ? "Joining..." : "Join Server"}
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