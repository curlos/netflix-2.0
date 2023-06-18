import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import HoveredMovie from './HoveredMovie';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

/**
 * @description - 
 * @returns {React.FC}
 */
const SmallMovie = ({ movie, hoveredValue, setHoveredValue }) => {
  const [_hoveredMovie, setHoveredMovie] = useState(false);
  const [_show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [details, setDetails] = useState();
  const [videos, setVideos] = useState();
  const [credits, setCredits] = useState();
  const [recommendedMovies, setRecommendedMovies] = useState();

  let timeoutId;

  const showHoveredMovie = async (newHoveredMovie) => {
    setLoading(true);
    setHoveredValue(newHoveredMovie);
    setHoveredMovie(newHoveredMovie);
    await getAndSetAllMovieDetails();
    setLoading(false);
  };

  const handleShow = async () => {
    setLoading(false);
    setShow(true);

  };

  const handleHover = async () => {

    if (!timeoutId) {
      timeoutId = window.setTimeout(() => {
        timeoutId = null;
        showHoveredMovie(movie);
      }, 700);
    }
  };

  const handleHoverLeave = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const getAndSetAllMovieDetails = async () => {
    setLoading(true);
    setDetails(await getMovieDetails());
    setVideos(await getVideos());
    setCredits(await getCredits());
    setRecommendedMovies(await getRecommendedMovies());
  };

  const getMovieDetails = async () => {
    if (movie.first_air_date) {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${movie.id}?api_key=${API_KEY}&language=en-US`);
      return response.data;
    } else {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=en-US`);
      return response.data;
    }
  };

  const getVideos = async () => {
    if (movie.first_air_date) {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${movie.id}/videos?api_key=${API_KEY}&language=en-US`);
      return response.data;
    } else {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`);
      return response.data;
    }
  };

  const getCredits = async () => {
    if (movie.first_air_date) {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${movie.id}/credits?api_key=${API_KEY}&language=en-US`);
      return response.data;
    } else {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}&language=en-US`);
      return response.data;
    }
  };

  const getRecommendedMovies = async () => {
    if (movie.first_air_date) {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${movie.id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`);
      return response.data;
    } else {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`);
      return response.data;
    }
  };

  const convertMinToHours = (n) => {
    var num = Number(n);
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);

    return {
      hours: rhours,
      minutes: rminutes
    };
  };

  const handleNavigation = () => {
    if (movie.first_air_date) {
      navigate(`/title/tv/${movie.id}`);
    } else {
      navigate(`/title/movie/${movie.id}`);
    }
  };


  return (
    <div className="flex-1" onClick={handleNavigation}>
      {hoveredValue && hoveredValue === movie && !loading ? (

        <div className="text-white">
          <HoveredMovie handleShow={handleShow} setHoveredValue={setHoveredValue} setHoveredMovie={setHoveredMovie} movie={movie} details={details} videos={videos} credits={credits} recommendedMovies={recommendedMovies} convertMinToHours={convertMinToHours} />
        </div>

      ) : (
        <div className="smallMovie text-white fs-6" onClick={handleShow} onMouseEnter={handleHover} onMouseLeave={handleHoverLeave}>
          <div>
            <img src={`https://image.tmdb.org/t/p/original${movie?.poster_path}`} alt="" className={`movieImage m-1 rounded`}
            />
          </div>

          {/* <div>{movie.title || movie.name}</div>

            <div>
              <span>{new Date(movie.release_date).getFullYear()} • {details.runtime}</span>
            </div> */}
        </div>
      )}
    </div>
  );
};

export default SmallMovie;