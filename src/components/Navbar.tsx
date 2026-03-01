"use client";

import Link from "next/link";
import { Search, Bell, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Auth State
    const [user, setUser] = useState<{ username: string, token: string } | null>(null);

    // Initial Auth Check
    useEffect(() => {
        // Safe check for window
        if (typeof window !== 'undefined') {
            const urlParams = new URL(window.location.href).searchParams;
            const tokenQuery = urlParams.get('token');
            const usernameQuery = urlParams.get('username');

            if (tokenQuery && usernameQuery) {
                // If returning from auth app, save state & clean URL
                localStorage.setItem('kodflix_token', tokenQuery);
                localStorage.setItem('kodflix_username', usernameQuery);
                setUser({ username: usernameQuery, token: tokenQuery });
                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                // Otherwise load from local storage
                const storedToken = localStorage.getItem('kodflix_token');
                const storedUsername = localStorage.getItem('kodflix_username');
                if (storedToken && storedUsername) {
                    setUser({ username: storedUsername, token: storedToken });
                }
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('kodflix_token');
        localStorage.removeItem('kodflix_username');
        setUser(null);
    };

    // Search State
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

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

    // Active Search Effect
    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        } else if (searchOpen && pathname === '/search') {
            // If they clear the search and are on the search page, maybe go home?
            router.push('/');
        }
    }, [searchQuery, router, searchOpen, pathname]);

    const toggleSearch = () => {
        if (searchOpen) {
            setSearchOpen(false);
            setSearchQuery("");
        } else {
            setSearchOpen(true);
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    };

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
                    {/* Animated Search Bar */}
                    <div className="flex items-center">
                        <AnimatePresence>
                            {searchOpen && (
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "320px", opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    className="overflow-hidden flex items-center bg-black/80 border border-white/50 rounded-full py-1.5 px-3"
                                >
                                    <Search className="w-5 h-5 text-white mr-1 flex-shrink-0" strokeWidth={2.5} />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Titles, people, genres"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-transparent border-none text-white text-sm focus:outline-none px-3 w-full"
                                    />
                                    <X
                                        className="w-4 h-4 text-white mr-2 cursor-pointer flex-shrink-0"
                                        onClick={toggleSearch}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!searchOpen && (
                            <button onClick={toggleSearch} className="text-white hover:text-gray-300 transition cursor-pointer">
                                <Search className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2.5} />
                            </button>
                        )}
                    </div>

                    <span className="hidden lg:block text-white text-sm font-semibold cursor-pointer hover:text-gray-300 transition">
                        Kids
                    </span>

                    <button className="text-white hover:text-gray-300 transition relative">
                        <Bell className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2} />
                        {/* Notification Dot */}
                        <div className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full border border-[#141414]"></div>
                    </button>

                    {/* Auth avatar & Logout */}
                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-bold text-white text-sm cursor-pointer border border-transparent hover:border-white transition-colors" title={user.username}>
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <button onClick={handleLogout} className="hidden lg:block text-xs font-semibold text-gray-300 hover:text-white transition">
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => window.location.href = 'http://localhost:5173/login'} className="bg-red-600 text-white px-4 py-1.5 rounded font-semibold text-sm hover:bg-red-700 transition">
                            Sign In
                        </button>
                    )}

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
