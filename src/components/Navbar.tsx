"use client";

import Link from "next/link";
import { Search, Bell, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Shows", href: "/category/shows" },
        { label: "Movies", href: "/category/movies" },
        { label: "New & Popular", href: "/category/new-and-popular" },
        { label: "My List", href: "/category/my-list" },
        { label: "Browse by Languages", href: "/category/browse-by-languages" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#141414] shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent"
                }`}
        >
            <div className="px-4 lg:px-12 py-4 flex items-center justify-between">
                {/* Left Side: Logo & Links */}
                <div className="flex items-center gap-8">
                    {/* Netflix Logo Replaced with KODFLIX */}
                    <Link href="/" className="text-red-600 font-extrabold text-2xl tracking-tighter hover:scale-105 transition-transform">
                        KODFLIX
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-5">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`text-sm font-semibold transition-colors duration-300 hover:text-gray-300 ${pathname === item.href ? "text-white" : "text-gray-200"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Side: Icons */}
                <div className="flex items-center gap-4 lg:gap-6">
                    <Link href="/search" className="text-white hover:text-gray-300 transition">
                        <Search className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2.5} />
                    </Link>

                    <span className="hidden lg:block text-white text-sm font-semibold cursor-pointer hover:text-gray-300 transition">
                        Kids
                    </span>

                    <button className="text-white hover:text-gray-300 transition relative">
                        <Bell className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2} />
                        {/* Notification Dot */}
                        <div className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full border border-[#141414]"></div>
                    </button>

                    {/* User Avatar Placeholder */}
                    <div className="w-8 h-8 rounded bg-red-600 overflow-hidden cursor-pointer border border-transparent hover:border-white transition-colors">
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">:-]</div>
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <button
                        className="lg:hidden text-white ml-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-[#141414] border-t border-gray-800 shadow-2xl py-4 px-6 flex flex-col gap-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-lg font-semibold transition-colors duration-300 ${pathname === item.href ? "text-white border-l-4 border-red-600 pl-2" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
