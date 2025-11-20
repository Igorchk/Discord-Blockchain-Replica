import "./globals.css";

export const metadata = {
  title: "Decentralized Discord",
  description: "A decentralized chat app built with Next.js and Web3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0e0e10] text-white">
        {children}
      </body>
    </html>
  );
}