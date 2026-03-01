"use client";

import Image from "next/image";
import { getImageUrl, getMovieDetails } from "@/lib/tmdb";
import { useHeroContext } from "@/context/HeroContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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
    const [isHovered, setIsHovered] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [trailer, setTrailer] = useState<any>(null);

    const posterPath = movie.poster_path;
    const title = movie.title || movie.name || movie.original_name;

    // Fetch trailer when hovered if not already fetched
    useEffect(() => {
        if (isHovered && !trailer) {
            const fetchTrailer = async () => {
                const mediaType = movie.media_type || (movie.name && !movie.title ? 'tv' : 'movie');
                const details = await getMovieDetails(movie.id, mediaType);
                const foundTrailer = details?.videos?.results?.find((vid: any) => vid.type === "Trailer" && vid.site === "YouTube") || details?.videos?.results?.[0];
                if (foundTrailer) {
                    setTrailer(foundTrailer);
                }
            };
            fetchTrailer();
        }
    }, [isHovered, movie, trailer]);

    const handleCardClick = () => {
        setActiveHero({ movieData: movie });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <motion.div
            variants={cardVariants}
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative min-w-[110px] md:min-w-[160px] lg:min-w-[200px] xl:min-w-[240px] aspect-[2/3] rounded-md overflow-hidden group cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:z-20 bg-[#141414]"
        >
            {isHovered && trailer ? (
                <iframe
                    className="absolute inset-0 w-full h-full object-cover scale-[1.35] pointer-events-none z-0"
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}&modestbranding=1&rel=0&showinfo=0`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
            ) : (
                <Image
                    src={getImageUrl(posterPath, "w500")}
                    alt={title}
                    fill
                    className="object-cover rounded-md z-10 relative"
                    sizes="(max-width: 640px) 110px, (max-width: 768px) 160px, (max-width: 1024px) 200px, 240px"
                />
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
                <h3 className="text-white font-bold text-sm line-clamp-2 drop-shadow-md">{title}</h3>
                <p className="text-green-400 text-xs font-bold mt-1 drop-shadow-md">
                    {movie.vote_average ? `${(movie.vote_average * 10).toFixed(0)}% Match` : "New"}
                </p>
            </div>
        </motion.div>
    );
}
