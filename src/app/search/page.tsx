import { searchMovies } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
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
        <div className="min-h-screen bg-[#141414] pt-16 px-8 lg:px-16 pb-20 w-full mb-12">
            <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-red-600 pl-4">Search</h1>

            <form className="mb-12 relative max-w-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                    name="q"
                    defaultValue={q || ''}
                    placeholder="Search for a movie or TV show..."
                    className="w-full bg-zinc-900 border border-zinc-700 text-white pl-16 pr-6 py-4 rounded-full focus:outline-none focus:border-white text-lg transition-colors"
                    autoComplete="off"
                />
            </form>

            {!q && (
                <div className="flex items-center justify-center h-[40vh]">
                    <p className="text-gray-500 text-xl font-medium">Enter a term to search across millions of movies & TV shows.</p>
                </div>
            )}

            {q && movies.length === 0 && (
                <p className="text-gray-400 text-lg">No results found for "<span className="text-white">{q}</span>".</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-6">
                {movies.map((m) => (
                    <MovieCard key={m.id} movie={m} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && movies.length > 0 && (
                <div className="flex justify-center items-center mt-16 gap-6">
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
    );
}
