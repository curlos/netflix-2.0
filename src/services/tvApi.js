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
    getTVShowSeasons: builder.query({
      query: ({ tvId, seasonNumber }) => `/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}&language=en-US`,
    }),
    getTVShowEpisode: builder.query({
      query: ({ tvId, seasonNumber, episodeNumber }) => `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${API_KEY}&language=en-US`,
    }),
  }),
});

export const {
  useGetTrendingQuery,
  useGetNetflixOriginalsQuery,
  useGetDiscoverTVQuery,
  useGetTVShowSeasonsQuery,
  useGetTVShowEpisodeQuery,
} = tvApi;