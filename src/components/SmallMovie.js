import React, { useState, useEffect, useCallback } from 'react'
import { getGenreNames } from '../utils/genres'
import {
  Link,
  useNavigate
} from "react-router-dom";
import axios from 'axios'
import MovieModal from './MovieModal'
import HoveredMovie from './HoveredMovie';
import { debounce } from 'lodash'

const API_KEY = process.env.REACT_APP_TMDB_API_KEY

const SmallMovie = ({ movie, hoveredValue, setHoveredValue }) => {
  const [hoveredMovie, setHoveredMovie] = useState(false)
  const genreNames = getGenreNames(movie?.genre_ids, movie.media_type).slice(0, 3)
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const [details, setDetails] = useState()
  const [videos, setVideos] = useState()
  const [credits, setCredits] = useState()
  const [recommendedMovies, setRecommendedMovies] = useState()

  const debounceHoveredMovie = useCallback(
    debounce(async (newHoveredMovie) => {
      setHoveredValue(newHoveredMovie)
      setHoveredMovie(newHoveredMovie)
      await getAndSetAllMovieDetails()
      setLoading(false)
    }, 500),
  [hoveredValue])


  const handleClose = () => {
    setVideos(null)
    setShow(false)
  };

  const handleShow = async () => {
    setLoading(false)
    setShow(true)

  };

  const handleHover = async () => {
    debounceHoveredMovie(movie)
  };

  const getAndSetAllMovieDetails = async () => {
    setLoading(true)
    setDetails(await getMovieDetails())
    setVideos(await getVideos())
    setCredits(await getCredits())
    setRecommendedMovies(await getRecommendedMovies())
  }

  const getMovieDetails = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=en-US`)
    return response.data
  }

  const getVideos = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`)
    return response.data
  }

  const getCredits = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}&language=en-US`)
    return response.data
  }

  const getRecommendedMovies = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`)
    return response.data
  }

  const convertMinToHours = (n) => {
      var num = Number(n);
      var hours = (num / 60);
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
      var rminutes = Math.round(minutes);
      
      return {
        hours: rhours,
        minutes: rminutes
      }
  }

  if(show) {
    console.log(videos)
  }
  

  return (
    <di className="flex-1"v>
      {hoveredMovie && hoveredMovie === movie && !loading ? (

        <div className="text-white">
          <HoveredMovie handleShow={handleShow} setHoveredValue={setHoveredValue} setHoveredMovie={setHoveredMovie} movie={movie} details={details} videos={videos} credits={credits} recommendedMovies={recommendedMovies} convertMinToHours={convertMinToHours}/>
        </div>
        
        ) : (
        <div className="smallMovie text-white fs-6" onClick={handleShow} onMouseEnter={handleHover} >
          <div>
            <img src={`https://image.tmdb.org/t/p/original${movie?.poster_path}`} alt="" className={`movieImage m-1 rounded`}
            />
          </div>
        </div>
      )}

      {show && !loading ? (
        <MovieModal movie={movie} show={show} handleClose={handleClose} convertMinToHours={convertMinToHours} details={details} videos={videos} credits={credits} recommendedMovies={recommendedMovies} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue}/>
      ) : null}
    </di>
  )
}

export default SmallMovie