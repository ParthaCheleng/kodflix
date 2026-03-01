"use client";

import Link from "next/link";
import { Search, Bell, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getNowPlaying, getImageUrl } from "@/lib/tmdb";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getNowPlaying();
                if (data?.results) setNotifications(data.results.slice(0, 5));
            } catch (e) {
                // Ignore silent failure
            }
        };
        fetchNotifications();
    }, []);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'Hindi' },
        { code: 'es', label: 'Español' },
        { code: 'fr', label: 'Français' },
        { code: 'de', label: 'Deutsch' },
        { code: 'ja', label: '日本語' },
        { code: 'ko', label: '한국어' },
    ];

    const handleLanguageChange = (langCode: string) => {
        const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectElement) {
            selectElement.value = langCode;
            selectElement.dispatchEvent(new Event('change'));
        }
        setLangDropdownOpen(false);
        setMobileMenuOpen(false);
    };

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
                let storedUsername = localStorage.getItem('kodflix_username');

                // Safety check in case they cached the literal default smiley string from earlier
                if (storedUsername === ':-]' || storedUsername === ':-)') {
                    localStorage.removeItem('kodflix_username');
                    storedUsername = null;
                }

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
        window.location.href = '/login';
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
    const handleSearch = () => {
        if (searchQuery.trim().length > 0) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

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

                    {/* Desktop Links (Using standard 'a' tags to prevent Google Translate React-hydration crashes) */}
                    <div className="hidden lg:flex items-center gap-5">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={`text-sm font-semibold transition-colors duration-300 hover:text-gray-300 ${pathname === item.href ? "text-white" : "text-gray-200"
                                    }`}
                            >
                                {item.label}
                            </a>
                        ))}

                        {/* Custom Language Dropdown replacing the old link */}
                        <div
                            className="relative group pt-4 pb-4 -my-4"
                            onMouseEnter={() => setLangDropdownOpen(true)}
                            onMouseLeave={() => setLangDropdownOpen(false)}
                        >
                            <button className="text-sm font-semibold transition-colors duration-300 text-gray-200 hover:text-gray-300 flex items-center gap-1 cursor-pointer">
                                Browse by Languages
                                <svg className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg>
                            </button>

                            <AnimatePresence>
                                {langDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute left-0 top-12 w-40 bg-black border border-gray-800 rounded-md shadow-2xl flex flex-col z-50 pointer-events-auto overflow-hidden"
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => handleLanguageChange(lang.code)}
                                                className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-900 transition-colors"
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
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
                                        placeholder="Search... (Press Enter)"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
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
                        Adults
                    </span>

                    {/* Notification Bell Dropdown */}
                    <div
                        className="relative group pt-4 pb-4 -my-4"
                        onMouseEnter={() => setNotificationsOpen(true)}
                        onMouseLeave={() => setNotificationsOpen(false)}
                    >
                        <button className="text-white hover:text-gray-300 transition relative flex items-center cursor-pointer">
                            <Bell className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2} />
                            {/* Notification Dot */}
                            <div className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full border border-[#141414]"></div>
                        </button>

                        <AnimatePresence>
                            {notificationsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 top-12 w-72 lg:w-80 bg-black/95 border border-gray-800 rounded-md shadow-2xl flex flex-col z-50 pointer-events-auto overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-gray-800 font-bold text-sm text-gray-200 bg-black">
                                        New Releases
                                    </div>
                                    <div className="max-h-[22rem] overflow-y-auto no-scrollbar pb-2 bg-black/95">
                                        {notifications.length > 0 ? notifications.map((movie) => (
                                            <div key={movie.id} onClick={() => router.push('/category/movies')} className="flex items-start gap-4 p-4 border-b border-gray-800/50 hover:bg-gray-900 transition cursor-pointer">
                                                <div className="w-16 h-24 relative rounded overflow-hidden flex-shrink-0 bg-gray-900">
                                                    <img src={getImageUrl(movie.poster_path, "w200")} alt={movie.title} className="object-cover w-full h-full" />
                                                </div>
                                                <div className="flex flex-col flex-1 pb-1">
                                                    <h4 className="text-white text-sm font-semibold mb-1 leading-tight line-clamp-2">{movie.title || movie.name}</h4>
                                                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-2">{movie.overview}</p>
                                                    <span className="text-gray-500 text-[10px] font-semibold">{new Date(movie.release_date || movie.first_air_date || Date.now()).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Auth avatar & Logout Dropdown */}
                    {user ? (
                        <div
                            className="relative group"
                            onMouseEnter={() => setProfileDropdownOpen(true)}
                            onMouseLeave={() => setProfileDropdownOpen(false)}
                        >
                            <div className="flex items-center gap-3 cursor-pointer">
                                <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-bold text-white text-sm border border-transparent group-hover:border-white transition-colors" title={user.username}>
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden lg:block">
                                    <svg className={`w-4 h-4 text-white transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {profileDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-4 w-48 bg-black border border-gray-800 rounded-md shadow-2xl flex flex-col z-50 pointer-events-auto overflow-hidden"
                                    >
                                        <button
                                            className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-900 transition-colors border-b border-gray-800"
                                        >
                                            My Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-900 transition-colors"
                                        >
                                            Sign out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="bg-red-600 text-white px-4 py-1.5 rounded font-semibold text-sm hover:bg-red-700 transition"
                        >
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
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-lg font-semibold transition-colors duration-300 ${pathname === item.href ? "text-white border-l-4 border-red-600 pl-2" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {item.label}
                        </a>
                    ))}

                    {/* Mobile Language Selector */}
                    <div className="pt-4 mt-2 border-t border-gray-800 flex flex-col gap-2">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Languages</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition"
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
