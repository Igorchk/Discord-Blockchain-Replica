"use client";

import { useState } from "react";
import { getContracts } from "@/lib/contracts";
import { useWeb3 } from "@/contexts/Web3Context";

export default function AddFriend({ onFriendAdded, onClose }) {
  const { signer } = useWeb3();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const contracts = getContracts(signer);

      const address = await contracts.user.getUserAddress(username);

      const isRegistered = await contracts.user.isRegistered(address);

      if (address === "0x0000000000000000000000000000000000000000") {
        setError("Username not found");
        setLoading(false);
        return;
      }

      if (!isRegistered) {
        setError("User is not registered");
        setLoading(false);
        return;
      }

      const verifyUsername = await contracts.user.getUsername(address);

      if (verifyUsername.toLowerCase() !== username.toLowerCase()) {
        setError("Username mismatch - something is wrong");
        setLoading(false);
        return;
      }

      onFriendAdded({ address, username: verifyUsername });
      setUsername("");
      onClose();
    } catch (err) {
      console.error("Error adding friend:", err);
      setError("Failed to find user: " + err.message);
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
          width: "400px",
          maxWidth: "90%",
        }}
      >
        <h2 style={{ fontSize: "24px", marginBottom: "16px", color: "white" }}>
          Add Friend
        </h2>

        <form onSubmit={handleAdd}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{ display: "block", marginBottom: "8px", color: "white" }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
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
                  : "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                color: "white",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              {loading ? "Adding..." : "Add Friend"}
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
      </div>
    </div>
  );
}
