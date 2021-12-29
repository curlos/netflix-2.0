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
import { useDispatch, useSelector } from 'react-redux'
import { selectHoveredMovie, hoverOverMovie } from '../features/userSlice'

const SmallMovie = ({ movie }) => {
  const dispatch = useDispatch()

  const [hoveredValue, setHoveredValue] = useState(null)
  const genreNames = getGenreNames(movie?.genre_ids, movie.media_type).slice(0, 3)
  const [OMDBMovieInfo, setOMDBMovieInfo] = useState(null)
  const [videos, setVideos] = useState()

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const hoveredMovie = useSelector(selectHoveredMovie)

  useEffect(() => {
    console.log(hoveredMovie)
    debounceHoveredMovie(hoveredValue)
  }, [])

  const debounceHoveredMovie = useCallback(
    debounce((newHoveredMovie) => {
      console.log(newHoveredMovie)
      dispatch(hoverOverMovie({ newHoveredMovie }))
    }, 500),
  [hoveredValue])


  const handleClose = () => {
    setOMDBMovieInfo(null)
    setVideos(null)
    setShow(false)
    navigate('/')
  };

  const handleShow = async () => {
    await getAndSetOMDBData()
    setLoading(false)
    setShow(true)
  };

  const handleHover = async () => {
    if (OMDBMovieInfo) {
      setHoveredValue(movie)
      setLoading(false)
      return
    }

    await getAndSetOMDBData()
    setHoveredValue(movie)
    setLoading(false)
  };

  const fetchMovieFromOMDB = async () => {
    const response = await axios.get(`https://www.omdbapi.com/?t=${movie.title || movie.name}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`)
    console.log(response.data)
    return response.data
  }

  const getVideos = async (OMDBMovieInfo) => {
    const response = await axios.get(`https://api.themoviedb.org/3/${OMDBMovieInfo.Type === 'movie' ? 'movie' : 'tv'}/${movie.id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`)
    return response.data
  }

  const getAndSetOMDBData = async () => {
    console.log('fetching')
    const movieData = await fetchMovieFromOMDB()
    const videoData = await getVideos(movieData)
    setOMDBMovieInfo(movieData)
    setVideos(videoData)
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
    <div>
      {hoveredMovie && hoveredMovie === movie ? (

        <HoveredMovie handleShow={handleShow} setHoveredValue={setHoveredValue} movie={movie} OMDBMovieInfo={OMDBMovieInfo} videos={videos} convertMinToHours={convertMinToHours}/>
        
        ) : (
        <Link to={`/title/${movie.id}`} className="smallMovie text-white fs-6" onClick={handleShow} onMouseEnter={handleHover} >
          <div>
            <img src={`https://image.tmdb.org/t/p/original${movie?.poster_path}`} alt="" className={`movieImage m-1 rounded`}
            />
          </div>
        </Link>
      )}

      {show && !loading ? (
        <MovieModal movie={movie} show={show} handleClose={handleClose} convertMinToHours={convertMinToHours} OMDBMovieInfo={OMDBMovieInfo} videos={videos}/>
      ) : null}
    </div>
  )
}

export default SmallMovie

