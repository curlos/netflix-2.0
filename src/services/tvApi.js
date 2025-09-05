import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
} = tvApi;