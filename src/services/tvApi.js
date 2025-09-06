import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TV_GENRES_BY_NAME } from '../utils/genres';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

export const tvApi = createApi({
  reducerPath: 'tvApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getTrending: builder.query({
      query: () => `/trending/all/week?api_key=${API_KEY}&language=en-US`,
    }),
    getNetflixOriginals: builder.query({
      query: () => `/discover/tv?api_key=${API_KEY}&with_networks=213`,
    }),
    getDiscoverTV: builder.query({
      query: () => `/discover/tv?api_key=${API_KEY}&language=en-US&page=1`,
    }),
    getTVShowDetails: builder.query({
      query: (tvId) => `/tv/${tvId}?api_key=${API_KEY}&language=en-US`,
    }),
    getTVShowSeasons: builder.query({
      query: ({ tvId, seasonNumber }) => `/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}&language=en-US`,
    }),
    getTVShowEpisode: builder.query({
      query: ({ tvId, seasonNumber, episodeNumber }) => `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${API_KEY}&language=en-US`,
    }),
    getTVVideos: builder.query({
      query: (tvId) => `/tv/${tvId}/videos?api_key=${API_KEY}&language=en-US`,
    }),
    getTVCredits: builder.query({
      query: (tvId) => `/tv/${tvId}/credits?api_key=${API_KEY}&language=en-US`,
    }),
    getTVRecommendations: builder.query({
      query: (tvId) => `/tv/${tvId}/recommendations?api_key=${API_KEY}&language=en-US&page=1`,
    }),
    getFilteredTVShows: builder.query({
      query: ({ genres, selectedYear, selectedSortType, pageNum }) => {
        const getIncludedGenresString = (genres) => {
          const genresArr = [];

          Object.keys(genres).forEach((genreName) => {
            if (genres[genreName]) {
              const genreObj = TV_GENRES_BY_NAME[genreName];
              if (genreObj) {
                genresArr.push(genreObj.id);
              }
            }
          });

          return genresArr.join(',');
        };

        const includedGenres = getIncludedGenresString(genres);
        
        if (selectedYear === 'All') {
          // If "All" is selected, don't apply any year filtering
          return `/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=${selectedSortType}&page=${pageNum}${includedGenres ? `&with_genres=${includedGenres}` : ''}`;
        } else if (selectedYear && String(selectedYear).includes('s')) {
          // If the selected year contains an 's', it's a decade (like 1980s which would span from 1980-01-01 to 1989-12-31).
          const startYear = selectedYear.slice(0, 4);
          const endYear = Number(startYear) + 9;
          return `/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=${selectedSortType}&page=${pageNum}&first_air_date.gte=${startYear}-01-01&first_air_date.lte=${endYear}-12-31${includedGenres ? `&with_genres=${includedGenres}` : ''}`;
        } else {
          // If not, then this is a single year, like 2012
          return `/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=${selectedSortType}&page=${pageNum}&first_air_date_year=${selectedYear}${includedGenres ? `&with_genres=${includedGenres}` : ''}`;
        }
      },
    }),
  }),
});

export const {
  useGetTrendingQuery,
  useGetNetflixOriginalsQuery,
  useGetDiscoverTVQuery,
  useGetTVShowDetailsQuery,
  useGetTVShowSeasonsQuery,
  useGetTVShowEpisodeQuery,
  useGetTVVideosQuery,
  useGetTVCreditsQuery,
  useGetTVRecommendationsQuery,
  useGetFilteredTVShowsQuery,
} = tvApi;