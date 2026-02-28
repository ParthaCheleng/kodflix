import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KodFlix",
  description: "A customized Netflix-like movie discovery app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#141414]`}>
        <Navbar />
        <main className="relative min-h-screen overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
