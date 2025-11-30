"use client";
import { useState } from "react";
import { getContracts } from "@/lib/contracts";
import { useWeb3 } from "@/contexts/Web3Context";

export default function AddChannel({ serverId, onChannelAdded, onClose }) {
  const { signer, account } = useWeb3();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter a channel name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const contracts = getContracts(signer);

      const serverData = await contracts.server.getServer(serverId);
      const serverOwner = serverData[1];

      if (serverOwner.toLowerCase() !== account.toLowerCase()) {
        setError("Only the server owner can create channels");
        setLoading(false);
        return;
      }

      await contracts.server.createChannel(serverId, name);

      const channelCount = await contracts.server.getChannelCount(serverId);
      const newChannelId = channelCount - 1;

      const newChannel = {
        id: newChannelId,
        name: name,
      };

      onChannelAdded(newChannel);
      setName("");
      onClose();
    } catch (err) {
      console.error("Error creating channel:", err);
      setError("Failed to create channel: " + err.message);
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
        <h2 style={{ fontSize: "24px", marginBottom: "16px", color: "white" }}>
          Create Channel
        </h2>

        <form onSubmit={handleAdd}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{ display: "block", marginBottom: "8px", color: "white" }}
            >
              Channel Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="announcements"
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
            <p
              style={{
                fontSize: "12px",
                opacity: 0.7,
                color: "white",
                marginTop: "6px",
              }}
            >
              Channel name (without #)
            </p>
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

          <div style={{ display: "flex", gap: "12px" }}>
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
                fontWeight: "bold",
              }}
            >
              {loading ? "Creating..." : "Create Channel"}
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