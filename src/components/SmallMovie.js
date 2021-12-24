import React, { useState, useEffect } from 'react'
import { getGenreNames } from '../utils/genres'
import {
  Link,
  useNavigate
} from "react-router-dom";
import axios from 'axios'
import MovieModal from './MovieModal'

const SmallMovie = ({ movie }) => {
  const [hoveredMovie, setHoveredMovie] = useState(null)
  const genreNames = getGenreNames(movie?.genre_ids, movie.media_type).slice(0, 3)
  const [OMDBMovieInfo, setOMDBMovieInfo] = useState()
  const [videos, setVideos] = useState()

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()


  const handleClose = () => {
    console.log('hello')
    window.location.href = 'http://localhost:3000/'
    setOMDBMovieInfo(null)
    setVideos(null)
    setShow(false)
  };
  const handleShow = async () => {
    const movieData = await fetchMovieFromOMDB()
    const videoData = await getVideos(movieData)
    setOMDBMovieInfo(movieData)
    setVideos(videoData)
    setLoading(false)
    setShow(true)

  };

  const fetchMovieFromOMDB = async () => {
    const response = await axios.get(`http://www.omdbapi.com/?t=${movie.title || movie.name}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`)
    console.log(response.data)
    return response.data
  }

  const getVideos = async (OMDBMovieInfo) => {
    const response = await axios.get(`https://api.themoviedb.org/3/${OMDBMovieInfo.Type === 'movie' ? 'movie' : 'tv'}/${movie.id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`)
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
    <Link to={`/title/${movie.id}`} className="smallMovie text-white fs-6" onClick={handleShow}>
      <div>
        <img src={`https://image.tmdb.org/t/p/original${movie?.poster_path}`} alt="" className={`movieImage m-1 rounded`} onMouseEnter={() => setHoveredMovie(movie.id)}
        onMouseLeave={() => setHoveredMovie(null)}
        />
      </div>

      {show && !loading ? (
        <MovieModal movie={movie} show={show} handleClose={handleClose} convertMinToHours={convertMinToHours} OMDBMovieInfo={OMDBMovieInfo} videos={videos}/>
      ) : null}
    </Link>
  )
}

export default SmallMovie