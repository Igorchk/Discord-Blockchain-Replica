export default function DashboardLayout({ children }) {
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
                {/* Server Icon */}
                <div
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
                    }}
                >
                    +
                </div>
            </div>

            {/* Friend List */}
            <div
                style = {{
                    width: "260px",
                    background: "rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(4px)",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                }}
            >
                <h2 style={{marginBottom: "20px", fontSize: "20px"}}>Friends</h2>

                <button style={{marginBottom: "20px"}}>Add Friend</button>

                <div style={{color: "white", opacity: 0.8}}>
                    <p className="mb-2">user#1234</p>
                    <p className="mb-2">user#5678</p>
                </div>
            </div>

            {/* Main Chat Panel */}
            <main style={{flex: 1, background: "rgba(0, 0, 0, 0.25)"}}>
                {children}
            </main>
        </div>
    );
}