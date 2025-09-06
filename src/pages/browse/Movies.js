import React from 'react';
import BrowsePage from '../../components/BrowsePage';
import { MOVIE_GENRES } from '../../utils/genres';
import { useGetPopularMoviesQuery, useGetFilteredMoviesQuery } from '../../services/movieApi';

/**
 * @description - Page that shows a list of movies and several, several pages of them. There are options to filter and sort the movies.
 * @returns {React.FC}
 */
const Movies = () => {
  const popularMoviesQuery = useGetPopularMoviesQuery();
  
  return (
    <BrowsePage 
      title="Movies"
      genres={MOVIE_GENRES}
      bannerQuery={popularMoviesQuery}
      useContentQuery={useGetFilteredMoviesQuery}
      paginationClassName="px-2 px-md-5"
    />
  );
};

export default Movies;
