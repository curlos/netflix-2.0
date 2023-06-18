import React, { useState, useEffect, useCallback } from 'react';
import TopNavbar from '../components/TopNavbar';
import Banner from '../components/Banner';
import requests, { API_BASE_URL } from '../requests';
import ContentCarousel from '../components/ContentCarousel';
import {
  useSearchParams
} from "react-router-dom";
import axios from 'axios';
import { debounce } from 'lodash';
import MovieList from '../components/MovieList';

/**
 * @description - The home page, the first page the user will land on by default. The user will see a banner (with a random movie or TV show)
 * as well as content from different categories or content filtered by their search query.
 * @returns {React.FC}
 */
const Home = () => {
  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [hoveredValue, setHoveredValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    // If the URL contains a query, then the user must have searched for something to filter movies by so we'll want to search for movies by that include or are related to the query the user entered.
    if (searchParams.get('query')) {
      debounceMovieSearch(searchParams.get('query'));
    }
    // Each time the query in the URL changes, scroll to the top. This is important as the most relevant results will probably be at the top and the user can search for movies on any of the pages in the site. So, they could be on a TV Shows page with a list of episodes so they had to scroll to the bottom to see all of this. If they were to type in a query in the search bar, it would go up.
    window.scrollTo(0, 0);
  }, [searchParams.get('query')]);

  const debounceMovieSearch = useCallback(
    // Waits for the user to stop typing for a full second. Once that happens, will then make an API call with the query the user searched for get movies that match it or are most relevant.
    debounce((searchQuery) => {
      axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${searchQuery}`)
        .then((response) => {
          setMovies(response.data.results);
          setTotalResults(response.data);
          setLoading(false);
        });
    }, 1000),
    []);

  return (
    <div className="bg-black vw-100 mw-100">
      <TopNavbar />
      {!searchParams.get('query') ? (
        // If the user did not search for anything, then just show the default home page where we show the banner (with a random movie or tv show) OR show different movies and tv shows by the default categories in the form of a carousel for each category.
        <div>
          <Banner />
          <div className="p-1 p-md-3">
            {Object.values(requests).map((request) => (
              <ContentCarousel apiUrl={API_BASE_URL + request.url} name={request.name} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue} />
            ))}
          </div>
        </div>
      ) : (
        loading ? (
          <div>Loader...</div>
        ) : (
          // If the user DID search for something, then we'd show them a list of movies filtered by the query they entered.
          <MovieList movies={movies} query={searchParams.get('query')} totalResults={totalResults} />
        )
      )}
    </div>
  );
};

export default Home;
