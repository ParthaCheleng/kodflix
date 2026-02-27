import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

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
      <body className={`${inter.className} flex min-h-screen bg-[#141414]`}>
        {/* Fixed left sidebar */}
        <Sidebar />
        {/* Main content area */}
        <main className="flex-1 ml-[72px] lg:ml-[96px] relative min-h-screen overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
