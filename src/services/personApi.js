import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

export const personApi = createApi({
  reducerPath: 'personApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getPersonDetails: builder.query({
      query: (personId) => `/person/${personId}?api_key=${API_KEY}&language=en-US`,
    }),
    getPersonCombinedCredits: builder.query({
      query: (personId) => `/person/${personId}/combined_credits?api_key=${API_KEY}&language=en-US`,
    }),
  }),
});

export const {
  useGetPersonDetailsQuery,
  useGetPersonCombinedCreditsQuery,
} = personApi;