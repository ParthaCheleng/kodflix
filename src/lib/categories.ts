export const CATEGORY_MAP: Record<string, { title: string; endpoint: string; extraParams?: Record<string, string> }> = {
    'now-playing': { title: 'New This Week', endpoint: '/movie/now_playing' },
    'trending': { title: 'Trending Now', endpoint: '/trending/all/day' },
    'top-rated': { title: 'Top Rated Movies', endpoint: '/movie/top_rated' },
    'action': { title: 'Action Movies', endpoint: '/discover/movie', extraParams: { with_genres: '28' } },
    'comedy': { title: 'Comedy Movies', endpoint: '/discover/movie', extraParams: { with_genres: '35' } },
};
