export const CATEGORY_MAP: Record<string, { title: string; endpoint: string; extraParams?: Record<string, string>; isPlaceholder?: boolean }> = {
    'now-playing': { title: 'New This Week', endpoint: '/movie/now_playing' },
    'trending': { title: 'Trending Now', endpoint: '/trending/all/day' },
    'top-rated': { title: 'Top Rated Movies', endpoint: '/movie/top_rated' },
    'action': { title: 'Action Movies', endpoint: '/discover/movie', extraParams: { with_genres: '28' } },
    'comedy': { title: 'Comedy Movies', endpoint: '/discover/movie', extraParams: { with_genres: '35' } },

    // New Navbar Categories
    'shows': { title: 'TV Shows', endpoint: '/discover/tv' },
    'movies': { title: 'Movies', endpoint: '/discover/movie' },
    'games': { title: 'Games', endpoint: '', isPlaceholder: true },
    'new-and-popular': { title: 'New & Popular', endpoint: '/movie/upcoming' },
    'my-list': { title: 'My List', endpoint: '', isPlaceholder: true },
    'browse-by-languages': { title: 'Browse by Languages', endpoint: '', isPlaceholder: true },
};
