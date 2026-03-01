"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
    const pathname = usePathname();

    // Hide Navbar on authentication pages
    if (pathname === '/login' || pathname === '/register') {
        return null;
    }

    return <Navbar />;
}
