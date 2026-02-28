"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/tmdb";
import { Play, Volume2, VolumeX, Info } from "lucide-react";
import { useState } from "react";

interface HeroProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    movieDetails: any;
}

export default function Hero({ movieDetails }: HeroProps) {
    const [isMuted, setIsMuted] = useState(true);

    if (!movieDetails) return <div className="h-[70vh] lg:h-[85vh] w-full bg-zinc-900 animate-pulse" />;

    const backdropPath = movieDetails.backdrop_path;
    const title = movieDetails.title || movieDetails.name || movieDetails.original_name;
    const overview = movieDetails.overview;
    const rating = movieDetails.vote_average ? movieDetails.vote_average.toFixed(1) : "N/A";

    const trailer = movieDetails?.videos?.results?.find(
        (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
    ) || movieDetails?.videos?.results?.[0];

    return (
        <div className="relative h-[70vh] lg:h-[85vh] w-full overflow-hidden bg-black">
            {/* Background Setup */}
            <div className="absolute top-0 left-0 w-full h-full">
                {trailer ? (
                    <div className="relative w-full h-[140%] -top-[20%] pointer-events-none">
                        <iframe
                            className="w-full h-full object-cover"
                            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${trailer.key}&modestbranding=1&rel=0&showinfo=0&origin=https://kodflix-clone.vercel.app`}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <Image
                        src={getImageUrl(backdropPath, "original")}
                        alt={title}
                        fill
                        priority
                        className="object-cover"
                    />
                )}
                {/* Gradients for blending with the background */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,20,20,1)] via-[rgba(20,20,20,0)] to-transparent bottom-0" />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 h-full flex flex-col justify-end lg:justify-center px-4 md:px-8 lg:px-16 w-full lg:w-2/3 pb-24 lg:pb-16 pt-32">
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="flex items-center gap-2 mb-2 lg:mb-4">
                        <span className="text-red-600 font-bold text-sm lg:text-lg tracking-widest">N</span>
                        <span className="text-gray-300 text-[10px] lg:text-xs tracking-[0.2em] uppercase font-semibold">Series</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl tracking-tight">
                        {title}
                    </h1>

                    <div className="hidden lg:flex items-center gap-4 text-sm font-semibold mb-6">
                        <div className="flex items-center gap-2">
                            <span className="bg-yellow-500 text-black px-1.5 py-0.5 rounded text-xs font-bold">IMDb</span>
                            <span className="text-white drop-shadow-md">{rating}/10</span>
                        </div>
                        <span className="text-green-400 drop-shadow-md">New</span>
                        <span className="text-gray-300 drop-shadow-md">HD</span>
                    </div>

                    <p className="text-gray-200 text-sm lg:text-base max-w-xl mb-6 lg:mb-8 line-clamp-3 drop-shadow-lg font-medium hidden md:block">
                        {overview}
                    </p>

                    <div className="flex items-center gap-3 lg:gap-4 w-full justify-center lg:justify-start">
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black px-6 lg:px-8 py-2 md:py-3 rounded font-bold transition-all hover:scale-105">
                            <Play className="w-5 h-5 lg:w-6 lg:h-6 fill-current" />
                            Play
                        </button>
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gray-500/50 hover:bg-gray-500/70 backdrop-blur-md text-white px-6 lg:px-8 py-2 md:py-3 rounded font-bold transition-all hover:scale-105">
                            <Info className="w-5 h-5 lg:w-6 lg:h-6" />
                            More Info
                        </button>
                    </div>
                </div>
            </div>

            {/* Mute/Unmute Toggle Button */}
            {trailer && (
                <div className="absolute bottom-24 lg:bottom-1/4 right-0 z-20 flex items-center">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 lg:p-3 border border-gray-400 rounded-full text-white hover:bg-white/10 transition mr-4 lg:mr-4 backdrop-blur-md"
                    >
                        {isMuted ? <VolumeX className="w-5 h-5 lg:w-6 lg:h-6" /> : <Volume2 className="w-5 h-5 lg:w-6 lg:h-6" />}
                    </button>
                    {/* Maturity Rating Box */}
                    <div className="hidden lg:flex items-center bg-black/40 border-l-[3px] border-white backdrop-blur-md text-white font-medium py-2 px-4 pr-12 text-lg">
                        13+
                    </div>
                </div>
            )}
        </div>
    );
}
