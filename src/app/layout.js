import { Web3Provider } from "@/contexts/Web3Context";
import "./globals.css";

export const metadata = {
  title: "Decentralized Discord",
  description: "Blockchain-based messaging platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
