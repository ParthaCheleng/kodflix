const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

const MOCK_DATA = {
    results: [
        {
            id: 1,
            title: "Money Heist - Fallback",
            name: "Money Heist - Fallback",
            backdrop_path: "/xGexTKCJDkl12d89pgHAHK815Tf.jpg",
            poster_path: "/xGexTKCJDkl12d89pgHAHK815Tf.jpg",
            overview: "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.",
            vote_average: 8.8,
            popularity: 100
        },
        {
            id: 2,
            title: "Stranger Things - Fallback",
            name: "Stranger Things - Fallback",
            backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
            poster_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
            overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
            vote_average: 8.6,
            popularity: 90
        }
    ]
};

const fetchFromTMDB = async (endpoint: string, params: Record<string, string> = {}) => {
    const queryParams = new URLSearchParams({
        api_key: API_KEY || '',
        ...params,
    });

    try {
        const response = await fetch(`${BASE_URL}${endpoint}?${queryParams.toString()}`);
        if (!response.ok) {
            console.warn(`TMDB fetch failed with status: ${response.status}. Using mock data.`);
            return MOCK_DATA;
        }
        return await response.json();
    } catch (error) {
        console.error("Network error accessing TMDB. Connection might be blocked:", error);
        // Fallback to MOCK_DATA to prevent crashing the whole app
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
    } catch (e) {
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
    // If the path is missing or we are using block-fallback, point to a placeholder.
    // We'll just return the TMDB URL and rely on Next/Image to handle it, or we can use a generic placeholder if TMDB images are blocked too.
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : '';
};
