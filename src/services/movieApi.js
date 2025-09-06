import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MOVIE_GENRES_BY_NAME } from '../utils/genres';

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
    getMovieDetails: builder.query({
      query: (movieId) => `/movie/${movieId}?api_key=${API_KEY}&language=en-US`,
    }),
    getMovieVideos: builder.query({
      query: (movieId) => `/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`,
    }),
    getMovieCredits: builder.query({
      query: (movieId) => `/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`,
    }),
    getMovieRecommendations: builder.query({
      query: (movieId) => `/movie/${movieId}/recommendations?api_key=${API_KEY}&language=en-US&page=1`,
    }),
    getSearchResults: builder.query({
      query: (searchQuery) => `/search/multi?api_key=${API_KEY}&query=${searchQuery}`,
    }),
    getFilteredMovies: builder.query({
      query: ({ genres, selectedYear, selectedSortType, pageNum }) => {
        const getIncludedGenresString = (genres) => {
          const genresArr = [];

          Object.keys(genres).forEach((genreName) => {
            if (genres[genreName]) {
              const movieGenreObj = MOVIE_GENRES_BY_NAME[genreName];
              if (movieGenreObj) {
                genresArr.push(movieGenreObj.id);
              }
            }
          });

          return genresArr.join(',');
        };

        const includedGenres = getIncludedGenresString(genres);
        
        if (selectedYear === 'All') {
          // If "All" is selected, don't apply any year filtering
          return `/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=${selectedSortType}&page=${pageNum}${includedGenres ? `&with_genres=${includedGenres}` : ''}`;
        } else if (selectedYear && String(selectedYear).includes('s')) {
          // If the selected year contains an 's', it's a decade (like 1980s which would span from 1980-01-01 to 1989-12-31).
          const startYear = selectedYear.slice(0, 4);
          const endYear = Number(startYear) + 9;
          return `/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=${selectedSortType}&page=${pageNum}&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31${includedGenres ? `&with_genres=${includedGenres}` : ''}`;
        } else {
          // If not, then this is a single year, like 2012
          return `/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=${selectedSortType}&page=${pageNum}&primary_release_year=${selectedYear}${includedGenres ? `&with_genres=${includedGenres}` : ''}`;
        }
      },
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
  useGetMovieDetailsQuery,
  useGetMovieVideosQuery,
  useGetMovieCreditsQuery,
  useGetMovieRecommendationsQuery,
  useGetSearchResultsQuery,
  useGetFilteredMoviesQuery,
} = movieApi;