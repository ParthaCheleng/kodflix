import { CATEGORY_MAP } from "@/lib/categories";
import { getMoviesByCategory } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import Hero from "@/components/Hero";
import MotionGrid from "@/components/MotionGrid";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CategoryPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ page?: string }>
}) {
    const { id } = await params;
    const { page } = await searchParams;

    const category = CATEGORY_MAP[id];
    if (!category) return notFound();

    if (category.isPlaceholder) {
        return (
            <div className="min-h-screen bg-[#141414] pt-28 px-8 lg:px-16 flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl font-bold text-white mb-4">{category.title}</h1>
                <p className="text-gray-400 text-lg">This feature will be fully functional once backend integration is complete.</p>
            </div>
        );
    }

    const currentPage = parseInt(page || '1', 10);
    const data = await getMoviesByCategory(category.endpoint, category.extraParams || {}, currentPage);

    const movies = data.results || [];
    const totalPages = Math.min(data.total_pages || 1, 500); // TMDB limits to 500 pages usually

    return (
        <div className="flex flex-col min-h-screen bg-black w-full pb-20 overflow-x-hidden">
            {/* Conditional Hero banner for category. Defaults to the first movie of the current page. */}
            {movies.length > 0 && (
                <Hero movieDetails={movies[0]} />
            )}

            <div className="relative z-20 -mt-24 lg:-mt-32 w-full px-4 lg:px-12">
                <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-red-600 pl-4">{category.title}</h1>

                <MotionGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-6">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {movies.map((m: any, index: number) => (
                        <MovieCard key={`${m.id}-${index}`} movie={m} />
                    ))}
                </MotionGrid>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-16 gap-6">
                        {currentPage > 1 ? (
                            <Link href={`/category/${id}?page=${currentPage - 1}`} className="px-6 py-2 bg-zinc-800 text-white rounded font-semibold hover:bg-zinc-700 transition">
                                Previous
                            </Link>
                        ) : (
                            <div className="px-6 py-2 bg-zinc-900/50 text-gray-600 rounded font-semibold cursor-not-allowed">Previous</div>
                        )}

                        <span className="text-gray-400 font-medium">Page <span className="text-white">{currentPage}</span> of {totalPages}</span>

                        {currentPage < totalPages ? (
                            <Link href={`/category/${id}?page=${currentPage + 1}`} className="px-6 py-2 bg-zinc-800 text-white rounded font-semibold hover:bg-zinc-700 transition">
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
