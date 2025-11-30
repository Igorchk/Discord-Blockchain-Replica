"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/contexts/Web3Context";
import { getContracts } from "@/lib/contracts";

export default function RegisterPage() {
  const { account, isConnected, signer } = useWeb3();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkIfRegistered() {
      if (isConnected && signer && account) {
        try {
          const contracts = getContracts(signer);
          const registered = await contracts.user.isRegistered(account);
          if (registered) {
            console.log("Already registered, redirecting to dashboard");
            router.push("/dashboard");
          }
        } catch (err) {
          console.error("Error checking registration:", err);
        }
      }
    }
    checkIfRegistered();
  }, [isConnected, signer, account, router]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const contracts = getContracts(signer);

      console.log("Registering username:", username);
      const tx = await contracts.user.registerUser(username);

      console.log("Transaction sent:", tx.hash);

      console.log("Registration complete");
      router.push("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);

      if (err.message.includes("Already registered")) {
        setError("This wallet is already registered");
      } else if (err.message.includes("Username taken")) {
        setError("This username is already taken");
      } else {
        setError("Failed to register. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "32px",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Not Connected
          </h1>
          <p style={{ marginBottom: "24px", opacity: 0.8 }}>
            Please connect your wallet to register
          </p>
          <button onClick={() => router.push("/")} style={{ width: "100%" }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "32px",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h1
          style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px" }}
        >
          Register Username
        </h1>
        <p style={{ marginBottom: "24px", opacity: 0.8 }}>
          Choose a unique username for your account
        </p>

        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "14px", opacity: 0.7, marginBottom: "8px" }}>
            Connected Wallet
          </div>
          <div
            style={{
              background: "rgba(0,0,0,0.3)",
              borderRadius: "8px",
              padding: "12px",
              fontFamily: "monospace",
              fontSize: "14px",
            }}
          >
            {account}
          </div>
        </div>

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                padding: "12px",
                color: "white",
                fontSize: "16px",
              }}
              disabled={loading}
              minLength={3}
              maxLength={32}
            />
            <p style={{ fontSize: "14px", opacity: 0.7, marginTop: "8px" }}>
              3-32 characters. Letters, numbers, and underscores only.
            </p>
          </div>

          {error && (
            <div
              style={{
                marginBottom: "16px",
                background: "rgba(239,68,68,0.2)",
                border: "1px solid rgb(239,68,68)",
                borderRadius: "8px",
                padding: "12px",
              }}
            >
              <p style={{ color: "rgb(252,165,165)" }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || username.length < 3}
            style={{
              width: "100%",
              opacity: loading || username.length < 3 ? 0.5 : 1,
            }}
          >
            {loading ? "Registering..." : "Register Username"}
          </button>
        </form>

        <button
          onClick={() => router.push("/")}
          style={{
            width: "100%",
            marginTop: "16px",
            background: "rgba(255,255,255,0.1)",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
