const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;

const MOCK_DATA = {
    results: [
        {
            id: 1,
            title: "Money Heist - Fallback",
            name: "Money Heist - Fallback",
            media_type: "tv",
            backdrop_path: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0",
            poster_path: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0",
            overview: "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.",
            vote_average: 8.8,
            popularity: 100,
            videos: {
                results: [{ type: "Trailer", site: "YouTube", key: "p_PJbmrXvO0" }]
            }
        },
        {
            id: 2,
            title: "Stranger Things - Fallback",
            name: "Stranger Things - Fallback",
            media_type: "tv",
            backdrop_path: "https://images.unsplash.com/photo-1616530940355-351fabd9524b",
            poster_path: "https://images.unsplash.com/photo-1616530940355-351fabd9524b",
            overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
            vote_average: 8.6,
            popularity: 90
        }
    ]
};

/**
 * Defensive TMDB fetcher.
 * - Bails out immediately if API_KEY is missing (avoids sending bad requests).
 * - Uses AbortController with a 8-second timeout to prevent hanging.
 * - Returns MOCK_DATA on ANY failure so the UI never crashes.
 */
const fetchFromTMDB = async (endpoint: string, params: Record<string, string> = {}) => {
    // If there is no API key at all, skip the network call entirely
    if (!API_KEY) return MOCK_DATA;

    const queryParams = new URLSearchParams({
        api_key: API_KEY,
        ...params,
    });

    const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(url, {
            signal: controller.signal,
            cache: 'no-store', // Prevent Next.js from caching failed responses
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return MOCK_DATA;
        }

        return await response.json();
    } catch {
        // Silently fall back – covers TypeError (network down), AbortError (timeout), etc.
        return MOCK_DATA;
    }
};

export const getTrending = async (timeWindow: 'day' | 'week' = 'day') => {
    return fetchFromTMDB(`/trending/all/${timeWindow}`);
};

export const getNowPlaying = async () => {
    return fetchFromTMDB('/movie/now_playing');
};

export const getTrendingMoviesAndTV = async () => {
    try {
        const [movies, tv] = await Promise.all([
            fetchFromTMDB('/trending/movie/day'),
            fetchFromTMDB('/trending/tv/day')
        ]);
        const combined = [...(movies?.results || []), ...(tv?.results || [])].sort((a, b) => b.popularity - a.popularity);
        return { results: combined.length ? combined : MOCK_DATA.results };
    } catch {
        return MOCK_DATA;
    }
};

export const getMovieDetails = async (id: number, type: 'movie' | 'tv' = 'movie') => {
    return fetchFromTMDB(`/${type}/${id}`, { append_to_response: 'videos' });
};

export const searchMovies = async (query: string, page: number = 1) => {
    return fetchFromTMDB('/search/multi', { query, page: page.toString() });
};

export const getMoviesByCategory = async (endpoint: string, extraParams: Record<string, string> = {}, page: number = 1) => {
    return fetchFromTMDB(endpoint, { page: page.toString(), ...extraParams });
};

export const getImageUrl = (path: string, size: string = 'original') => {
    if (!path) {
        return size === 'original'
            ? 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0'
            : 'https://images.unsplash.com/photo-1616530940355-351fabd9524b';
    }
    if (path.startsWith('http')) return path;
    return `https://image.tmdb.org/t/p/${size}${path}`;
};
