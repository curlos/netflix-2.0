import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

export const movieApi = createApi({
  reducerPath: 'movieApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getTopRatedMovies: builder.query({
      query: (page = 1) => `/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`,
    }),
    getActionMovies: builder.query({
      query: (page = 1) => `/discover/movie?api_key=${API_KEY}&with_genres=28&page=${page}`,
    }),
    getComedyMovies: builder.query({
      query: (page = 1) => `/discover/movie?api_key=${API_KEY}&with_genres=35&page=${page}`,
    }),
    getHorrorMovies: builder.query({
      query: (page = 1) => `/discover/movie?api_key=${API_KEY}&with_genres=27&page=${page}`,
    }),
    getRomanceMovies: builder.query({
      query: (page = 1) => `/discover/movie?api_key=${API_KEY}&with_genres=10749&page=${page}`,
    }),
    getDocumentaries: builder.query({
      query: (page = 1) => `/discover/movie?api_key=${API_KEY}&with_genres=99&page=${page}`,
    }),
    getMovieDetails: builder.query({
      query: (movieId) => `/movie/${movieId}?api_key=${API_KEY}&language=en-US`,
    }),
  }),
});

export const {
  useGetPopularMoviesQuery,
  useGetLatestMovieQuery,
  useGetTopRatedMoviesQuery,
  useGetUpcomingMoviesQuery,
  useGetActionMoviesQuery,
  useGetComedyMoviesQuery,
  useGetHorrorMoviesQuery,
  useGetRomanceMoviesQuery,
  useGetDocumentariesQuery,
  useGetMovieDetailsQuery,
} = movieApi;