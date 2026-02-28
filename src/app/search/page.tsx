import { searchMovies } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import Hero from "@/components/Hero";
import MotionGrid from "@/components/MotionGrid";
import Link from "next/link";
import { Search } from "lucide-react";

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string, page?: string }>
}) {
    const { q, page } = await searchParams;
    const currentPage = parseInt(page || '1', 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let movies: any[] = [];
    let totalPages = 1;

    if (q) {
        const data = await searchMovies(q, currentPage);
        // Exclude persons layout to keep it simple since we only have MovieCard
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        movies = data.results?.filter((m: any) => m.media_type !== "person") || [];
        totalPages = Math.min(data.total_pages || 1, 500);
    }

    return (
        <div className="flex flex-col min-h-screen bg-black w-full pb-20 overflow-x-hidden">
            {/* Conditional Hero banner for search results. Defaults to the first movie result. */}
            {movies.length > 0 && (
                <Hero movieDetails={movies[0]} />
            )}

            <div className={`relative z-20 w-full px-4 lg:px-12 ${movies.length > 0 ? "-mt-24 lg:-mt-32" : "pt-28"}`}>
                <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-red-600 pl-4">Search</h1>



                {!q && (
                    <div className="flex items-center justify-center h-[40vh]">
                        <p className="text-gray-500 text-xl font-medium">Enter a term to search across millions of movies & TV shows.</p>
                    </div>
                )}

                {q && movies.length === 0 && (
                    <p className="text-gray-400 text-lg">No results found for "<span className="text-white">{q}</span>".</p>
                )}

                <MotionGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-6">
                    {movies.map((m, index) => (
                        <MovieCard key={`${m.id}-${index}`} movie={m} />
                    ))}
                </MotionGrid>

                {/* Pagination */}
                {totalPages > 1 && movies.length > 0 && (
                    <div className="flex justify-center items-center mt-16 gap-6 pt-12">
                        {currentPage > 1 ? (
                            <Link href={`/search?q=${q}&page=${currentPage - 1}`} className="px-6 py-2 bg-zinc-800 text-white rounded font-semibold hover:bg-zinc-700 transition">
                                Previous
                            </Link>
                        ) : (
                            <div className="px-6 py-2 bg-zinc-900/50 text-gray-600 rounded font-semibold cursor-not-allowed">Previous</div>
                        )}

                        <span className="text-gray-400 font-medium">Page <span className="text-white">{currentPage}</span> of {totalPages}</span>

                        {currentPage < totalPages ? (
                            <Link href={`/search?q=${q}&page=${currentPage + 1}`} className="px-6 py-2 bg-zinc-800 text-white rounded font-semibold hover:bg-zinc-700 transition">
                                Next
                            </Link>
                        ) : (
                            <div className="px-6 py-2 bg-zinc-900/50 text-gray-600 rounded font-semibold cursor-not-allowed">Next</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
