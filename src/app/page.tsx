import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import { getMoviesByCategory, getMovieDetails, getTrendingMoviesAndTV } from "@/lib/tmdb";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch data concurrently on the server
  const [trendingCombined, nowPlaying, topRated, action, comedy] = await Promise.all([
    getTrendingMoviesAndTV(),
    getMoviesByCategory('/movie/now_playing'),
    getMoviesByCategory('/movie/top_rated'),
    getMoviesByCategory('/discover/movie', { with_genres: '28' }),
    getMoviesByCategory('/discover/movie', { with_genres: '35' }),
  ]);

  // Using the most popular trending item as the Hero
  let heroMovie = trendingCombined?.results?.[0] || null;
  // Fetch details (videos) for Hero if available
  if (heroMovie?.id) {
    try {
      const details = await getMovieDetails(heroMovie.id, heroMovie.media_type || 'movie');
      // Merge details with the shallow hero item
      heroMovie = { ...heroMovie, ...details };
    } catch (e) { /* ignore to fallback to banner */ }
  }

  // Row Data slices
  const newThisWeek = nowPlaying?.results?.slice(0, 20) || [];
  const trendingNow = trendingCombined?.results?.slice(0, 20) || [];
  const topRatedMovies = topRated?.results?.slice(0, 20) || [];
  const actionMovies = action?.results?.slice(0, 20) || [];
  const comedyMovies = comedy?.results?.slice(0, 20) || [];

  return (
    <div className="flex flex-col min-h-screen bg-black w-full pb-20 overflow-x-hidden">
      <Hero movieDetails={heroMovie} />

      {/* Container for rows, pulled up to overlap slightly with Hero gradient */}
      <div className="relative z-20 -mt-24 lg:-mt-32 space-y-4 pb-12 w-full">
        <MovieRow title="New this week" movies={newThisWeek} categoryId="now-playing" />
        <MovieRow title="Trending Now" movies={trendingNow} categoryId="trending" />
        <MovieRow title="Top Rated Movies" movies={topRatedMovies} categoryId="top-rated" />
        <MovieRow title="Action Movies" movies={actionMovies} categoryId="action" />
        <MovieRow title="Comedy Movies" movies={comedyMovies} categoryId="comedy" />
      </div>
    </div>
  );
}
