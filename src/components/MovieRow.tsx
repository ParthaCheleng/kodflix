"use client";

import MovieCard from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const rowVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

interface MovieRowProps {
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    movies: any[];
    categoryId?: string;
}

export default function MovieRow({ title, movies, categoryId }: MovieRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);

    if (!movies || movies.length === 0) return null;

    const handleScroll = (direction: "left" | "right") => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollAmount = direction === "left" ? scrollLeft - clientWidth + 100 : scrollLeft + clientWidth - 100;
            rowRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <div className="mb-10 px-8 lg:px-16 group/row relative">
            <div className="flex items-end justify-between mb-4 pl-2">
                <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-sm">{title}</h2>
                {categoryId && (
                    <Link href={`/category/${categoryId}`} className="text-sm font-semibold text-gray-400 hover:text-white transition-colors flex items-center gap-1 group/link">
                        See all <span className="opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all">›</span>
                    </Link>
                )}
            </div>

            {/* Scroll Controls (Hidden on mobile, appears on hover) */}
            <button
                className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-black/50 p-2 opacity-0 group-hover/row:opacity-100 hover:bg-black/80 transition-all h-full max-h-[220px] items-center justify-center hidden md:flex"
                onClick={() => handleScroll("left")}
            >
                <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            <button
                className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-black/50 p-2 opacity-0 group-hover/row:opacity-100 hover:bg-black/80 transition-all h-full max-h-[220px] items-center justify-center hidden md:flex"
                onClick={() => handleScroll("right")}
            >
                <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {/* Scrollable Container */}
            <motion.div
                ref={rowRef}
                variants={rowVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="flex gap-4 overflow-x-auto no-scrollbar pb-8 pt-4 px-2 -mx-2 snap-x scroll-smooth"
            >
                {movies.map((movie, index) => (
                    <div key={`${categoryId || 'row'}-${movie.id}-${index}`} className="snap-start shrink-0">
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
