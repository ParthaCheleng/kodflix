"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/tmdb";
import { useHeroContext } from "@/context/HeroContext";
import { motion } from "framer-motion";

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

interface MovieCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    movie: any;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const { setActiveHero } = useHeroContext();
    const posterPath = movie.poster_path;
    const title = movie.title || movie.name || movie.original_name;

    const handleCardClick = () => {
        setActiveHero({ movieData: movie });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <motion.div
            variants={cardVariants}
            onClick={handleCardClick}
            className="relative min-w-[110px] md:min-w-[160px] lg:min-w-[200px] xl:min-w-[240px] aspect-[2/3] rounded-md overflow-hidden group cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:z-20"
        >
            <Image
                src={getImageUrl(posterPath, "w500")}
                alt={title}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 640px) 110px, (max-width: 768px) 160px, (max-width: 1024px) 200px, 240px"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-sm line-clamp-2">{title}</h3>
                <p className="text-green-400 text-xs font-semibold mt-1">
                    {movie.vote_average ? `${(movie.vote_average * 10).toFixed(0)}% Match` : "New"}
                </p>
            </div>
        </motion.div>
    );
}
