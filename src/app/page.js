"use client";

import { useWeb3 } from "@/contexts/Web3Context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getContracts } from "@/lib/contracts";

export default function Home() {
  const { account, isConnected, connectWallet, signer } = useWeb3();
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function checkRegistration() {
      if (isConnected && signer) {
        try {
          const contracts = getContracts(signer);
          const registered = await contracts.user.isRegistered(account);
          setIsRegistered(registered);

          if (registered) {
            const name = await contracts.user.getUsername(account);
            setUsername(name);
          }
        } catch (error) {
          console.error("Error checking registration:", error);
        }
      }
    }

    checkRegistration();
  }, [isConnected, signer, account]);

  useEffect(() => {
    if (isRegistered) {
      router.push("/dashboard");
    }
  }, [isRegistered, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            Decentralized Discord
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            True censorship resistance. Own your data. No central server.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          {!isConnected ? (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-semibold text-white mb-6">
                  Connect Your Wallet to Get Started
                </h2>

                <button
                  onClick={connectWallet}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  Connect MetaMask
                </button>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="bg-white/5 p-6 rounded-lg">
                    <div className="text-4xl mb-2">LOCK</div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Censorship Resistant
                    </h3>
                    <p className="text-gray-300">
                      No central authority can delete your messages or ban your
                      account
                    </p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-lg">
                    <div className="text-4xl mb-2">STORAGE</div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      IPFS Storage
                    </h3>
                    <p className="text-gray-300">
                      Messages stored on decentralized IPFS network, not
                      corporate servers
                    </p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-lg">
                    <div className="text-4xl mb-2">CHAIN</div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Blockchain Verified
                    </h3>
                    <p className="text-gray-300">
                      Every message is cryptographically verified on the
                      blockchain
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="mb-6">
                  <div className="text-sm text-gray-400 mb-2">
                    Connected Account
                  </div>
                  <div className="bg-black/30 rounded-lg py-3 px-4 text-white font-mono">
                    {account}
                  </div>
                </div>

                {!isRegistered ? (
                  <>
                    <h2 className="text-3xl font-semibold text-white mb-4">
                      Register Your Username
                    </h2>
                    <p className="text-gray-300 mb-6">
                      Choose a unique username to get started
                    </p>

                    <button
                      onClick={() => router.push("/register")}
                      className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105 shadow-lg"
                    >
                      Register Now
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-semibold text-white mb-4">
                      Welcome back, {username}
                    </h2>
                    <p className="text-gray-300 mb-6">
                      Redirecting to dashboard...
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Powered by Ethereum, IPFS, Next.js</p>
          <p className="mt-2">CSC196D Blockchain DApp Project</p>
        </div>
      </div>
    </div>
  );
}
