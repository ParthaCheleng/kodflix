import Image from "next/image";
import { getImageUrl } from "@/lib/tmdb";
import { Play } from "lucide-react";

interface HeroProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    movieDetails: any;
}

export default function Hero({ movieDetails }: HeroProps) {
    if (!movieDetails) return <div className="h-[70vh] w-full bg-zinc-900 animate-pulse" />;

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
                            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}&modestbranding=1&rel=0&showinfo=0&origin=https://kodflix-clone.vercel.app`}
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
            <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-16 w-full lg:w-2/3 mt-12 pb-16">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-red-600 font-bold text-lg tracking-widest">N</span>
                    <span className="text-gray-300 text-xs tracking-[0.2em] uppercase font-semibold">Series</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl tracking-tight">
                    {title}
                </h1>

                <div className="flex items-center gap-4 text-sm font-semibold mb-6">
                    <div className="flex items-center gap-2">
                        <span className="bg-yellow-500 text-black px-1.5 py-0.5 rounded text-xs font-bold">IMDb</span>
                        <span className="text-white drop-shadow-md">{rating}/10</span>
                    </div>
                    <span className="text-green-400 drop-shadow-md">New</span>
                    <span className="text-gray-300 drop-shadow-md">HD</span>
                </div>

                <p className="text-gray-200 text-base max-w-xl mb-8 line-clamp-3 drop-shadow-lg font-medium">
                    {overview}
                </p>

                <div className="flex items-center gap-4">
                    <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black px-8 py-3 rounded font-bold transition-all hover:scale-105">
                        <Play className="w-6 h-6 fill-current" />
                        Play
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-gray-500/50 hover:bg-gray-500/70 backdrop-blur-md text-white px-8 py-3 rounded font-bold transition-all hover:scale-105">
                        More Info
                    </button>
                </div>
            </div>
        </div>
    );
}
