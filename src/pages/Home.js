import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/TopNavbar';
import Banner from '../components/Banner';
import ContentCarousel from '../components/ContentCarousel';
import {
  useSearchParams
} from "react-router-dom";
import MovieList from '../components/MovieList';
import { 
  useGetTopRatedMoviesQuery,
  useGetActionMoviesQuery,
  useGetComedyMoviesQuery,
  useGetHorrorMoviesQuery,
  useGetRomanceMoviesQuery,
  useGetDocumentariesQuery,
  useGetSearchResultsQuery
} from '../services/movieApi';
import { 
  useGetTrendingQuery,
  useGetNetflixOriginalsQuery
} from '../services/tvApi';

// Category names for content carousels
const categoryNames = ['Trending', 'Netflix Originals', 'Top Rated', 'Action', 'Comedy', 'Horror', 'Romance', 'Documentaries'];

/**
 * @description - The home page, the first page the user will land on by default. The user will see a banner (with a random movie or TV show)
 * as well as content from different categories or content filtered by their search query.
 * @returns {React.FC}
 */
const Home = () => {
  const [hoveredValue, setHoveredValue] = useState(null);
  const [searchParams] = useSearchParams();

  // Get search query and page from URL params
  const searchQuery = searchParams.get('query');
  const pageNum = parseInt(searchParams.get('page')) || 1;
  
  // RTK Query for search results (only when there's a search query)
  const searchResults = useGetSearchResultsQuery({ query: searchQuery, page: pageNum }, { 
    skip: !searchQuery 
  });

  // RTK Query hooks for different categories
  const trendingQuery = useGetTrendingQuery();
  const netflixOriginalsQuery = useGetNetflixOriginalsQuery();
  const topRatedQuery = useGetTopRatedMoviesQuery();
  const actionQuery = useGetActionMoviesQuery();
  const comedyQuery = useGetComedyMoviesQuery();
  const horrorQuery = useGetHorrorMoviesQuery();
  const romanceQuery = useGetRomanceMoviesQuery();
  const documentariesQuery = useGetDocumentariesQuery();

  // Data mapping function to get the right query result for each category
  const getQueryDataForCategory = (categoryName) => {
    switch(categoryName) {
      case 'Trending':
        return trendingQuery;
      case 'Netflix Originals':
        return netflixOriginalsQuery;
      case 'Top Rated':
        return topRatedQuery;
      case 'Action':
        return actionQuery;
      case 'Comedy':
        return comedyQuery;
      case 'Horror':
        return horrorQuery;
      case 'Romance':
        return romanceQuery;
      case 'Documentaries':
        return documentariesQuery;
      default:
        return { data: null, isLoading: false, error: null };
    }
  };

  useEffect(() => {
    // Each time the query in the URL changes, scroll to the top. This is important as the most relevant results will probably be at the top and the user can search for movies on any of the pages in the site.
    window.scrollTo(0, 0);
  }, [searchQuery]);

  return (
    <div className="bg-black vw-100 mw-100">
      <TopNavbar />
      {!searchQuery ? (
        // If the user did not search for anything, then just show the default home page where we show the banner (with a random movie or tv show) OR show different movies and tv shows by the default categories in the form of a carousel for each category.
        <div>
          <Banner data={netflixOriginalsQuery.data} isLoading={netflixOriginalsQuery.isLoading} />
          <div className="p-1 p-md-3">
            {categoryNames.map((categoryName) => {
              const { data, isLoading } = getQueryDataForCategory(categoryName);
              const movies = data?.results || [];
              return (
                <ContentCarousel 
                  key={categoryName} 
                  name={categoryName} 
                  movies={movies}
                  isLoading={isLoading}
                  hoveredValue={hoveredValue} 
                  setHoveredValue={setHoveredValue} 
                />
              );
            })}
          </div>
        </div>
      ) : (
        searchResults.isLoading ? (
          <div>Loader...</div>
        ) : (
          // If the user DID search for something, then we'd show them a list of movies filtered by the query they entered.
          <MovieList movies={searchResults.data?.results || []} query={searchQuery} totalResults={searchResults.data} />
        )
      )}
    </div>
  );
};

export default Home;
