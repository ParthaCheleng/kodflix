import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import { HeroProvider } from "@/context/HeroContext";

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
        <HeroProvider>
          {/* Hidden Google Translate container */}
          <div id="google_translate_element" style={{ display: 'none' }}></div>
          <NavbarWrapper />
          <main className="relative min-h-screen overflow-x-hidden">
            {children}
          </main>
        </HeroProvider>

        {/* Google Translate Script */}
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async></script>
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `
        }}></script>
      </body>
    </html>
  );
}
