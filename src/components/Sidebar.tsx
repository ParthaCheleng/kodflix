"use client";

import Link from "next/link";
import { Search, Home, Clapperboard, MonitorPlay, TrendingUp, Plus, Shuffle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { icon: Search, href: "/search", label: "Search" },
    ];

    return (
        <nav className="fixed left-0 top-0 h-full w-[72px] lg:w-[96px] bg-black/60 backdrop-blur-md flex flex-col items-center py-8 z-50 border-r border-white/5">
            <div className="flex flex-col flex-1 items-center space-y-8 w-full">
                {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            href={item.href}
                            key={index}
                            className="group relative flex items-center justify-center p-2 rounded-lg transition-all"
                        >
                            {/* Active Marker */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-red-600 rounded-r-md transition-all duration-300" />
                            )}

                            <Icon
                                strokeWidth={isActive ? 2.5 : 2}
                                className={`w-6 h-6 lg:w-7 lg:h-7 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
                            />
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
