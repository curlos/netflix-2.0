import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

export const movieApi = createApi({
  reducerPath: 'movieApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getPopularMovies: builder.query({
      query: () => `/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
    }),
    getTopRatedMovies: builder.query({
      query: () => `/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
    }),
    getActionMovies: builder.query({
      query: () => `/discover/movie?api_key=${API_KEY}&with_genres=28&page=1`,
    }),
    getComedyMovies: builder.query({
      query: () => `/discover/movie?api_key=${API_KEY}&with_genres=35&page=1`,
    }),
    getHorrorMovies: builder.query({
      query: () => `/discover/movie?api_key=${API_KEY}&with_genres=27&page=1`,
    }),
    getRomanceMovies: builder.query({
      query: () => `/discover/movie?api_key=${API_KEY}&with_genres=10749&page=1`,
    }),
    getDocumentaries: builder.query({
      query: () => `/discover/movie?api_key=${API_KEY}&with_genres=99&page=1`,
    }),
    getSearchResults: builder.query({
      query: ({ query, page = 1 }) => `/search/multi?api_key=${API_KEY}&query=${query}&page=${page}`,
    }),
  }),
});

export const {
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetActionMoviesQuery,
  useGetComedyMoviesQuery,
  useGetHorrorMoviesQuery,
  useGetRomanceMoviesQuery,
  useGetDocumentariesQuery,
  useGetSearchResultsQuery,
} = movieApi;