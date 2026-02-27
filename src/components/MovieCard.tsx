import Image from "next/image";
import { getImageUrl } from "@/lib/tmdb";

interface MovieCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    movie: any;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const posterPath = movie.poster_path;
    const title = movie.title || movie.name || movie.original_name;

    return (
        <div className="relative min-w-[140px] md:min-w-[180px] lg:min-w-[220px] aspect-[2/3] rounded-md overflow-hidden group cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:z-20">
            <Image
                src={getImageUrl(posterPath, "w500")}
                alt={title}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 140px, (max-width: 1024px) 180px, 220px"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-sm line-clamp-2">{title}</h3>
                <p className="text-green-400 text-xs font-semibold mt-1">
                    {movie.vote_average ? `${(movie.vote_average * 10).toFixed(0)}% Match` : "New"}
                </p>
            </div>
        </div>
    );
}
