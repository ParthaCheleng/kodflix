"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface HeroMovie {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    movieData: any;
}

interface HeroContextType {
    activeHero: HeroMovie | null;
    setActiveHero: (hero: HeroMovie | null) => void;
}

const HeroContext = createContext<HeroContextType | undefined>(undefined);

export function HeroProvider({ children }: { children: ReactNode }) {
    const [activeHero, setActiveHero] = useState<HeroMovie | null>(null);

    return (
        <HeroContext.Provider value={{ activeHero, setActiveHero }}>
            {children}
        </HeroContext.Provider>
    );
}

export function useHeroContext() {
    const context = useContext(HeroContext);
    if (context === undefined) {
        throw new Error("useHeroContext must be used within a HeroProvider");
    }
    return context;
}
