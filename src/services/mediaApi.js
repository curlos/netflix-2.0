import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MOVIE_GENRES_BY_NAME, TV_GENRES_BY_NAME } from '../utils/genres';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

export const mediaApi = createApi({
  reducerPath: 'mediaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getMediaDetails: builder.query({
      query: ({ mediaType, id }) => `/${mediaType}/${id}?api_key=${API_KEY}&language=en-US`,
    }),
    getMediaVideos: builder.query({
      query: ({ mediaType, id }) => `/${mediaType}/${id}/videos?api_key=${API_KEY}&language=en-US`,
    }),
    getMediaCredits: builder.query({
      query: ({ mediaType, id }) => `/${mediaType}/${id}/credits?api_key=${API_KEY}&language=en-US`,
    }),
    getMediaRecommendations: builder.query({
      query: ({ mediaType, id }) => `/${mediaType}/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`,
    }),
    getFilteredMedia: builder.query({
      query: ({ mediaType, genres, selectedYear, selectedSortType, pageNum }) => {
        const getIncludedGenresString = (genres, mediaType) => {
          const genresArr = [];
          const genresByName = mediaType === 'movie' ? MOVIE_GENRES_BY_NAME : TV_GENRES_BY_NAME;

          Object.keys(genres).forEach((genreName) => {
            if (genres[genreName]) {
              const genreObj = genresByName[genreName];
              if (genreObj) {
                genresArr.push(genreObj.id);
              }
            }
          });

          return genresArr.join(',');
        };

        const includedGenres = getIncludedGenresString(genres, mediaType);
        
        if (selectedYear === 'All') {
          return `/discover/${mediaType}?api_key=${API_KEY}&language=en-US&sort_by=${selectedSortType}&page=${pageNum}${includedGenres ? `&with_genres=${includedGenres}` : ''}`;
        } else if (selectedYear && String(selectedYear).includes('s')) {
          const startYear = selectedYear.slice(0, 4);
          const endYear = Number(startYear) + 9;
          
          if (mediaType === 'movie') {
            return `/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=${selectedSortType}&page=${pageNum}&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31${includedGenres ? `&with_genres=${includedGenres}` : ''}`;
          } else {
            return `/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=${selectedSortType}&page=${pageNum}&first_air_date.gte=${startYear}-01-01&first_air_date.lte=${endYear}-12-31${includedGenres ? `&with_genres=${includedGenres}` : ''}`;
          }
        } else {
          if (mediaType === 'movie') {
            return `/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=${selectedSortType}&page=${pageNum}&primary_release_year=${selectedYear}${includedGenres ? `&with_genres=${includedGenres}` : ''}`;
          } else {
            return `/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=${selectedSortType}&page=${pageNum}&first_air_date_year=${selectedYear}${includedGenres ? `&with_genres=${includedGenres}` : ''}`;
          }
        }
      },
    }),
  }),
});

export const {
  useGetMediaDetailsQuery,
  useGetMediaVideosQuery,
  useGetMediaCreditsQuery,
  useGetMediaRecommendationsQuery,
  useGetFilteredMediaQuery,
} = mediaApi;