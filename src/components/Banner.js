import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import requests, { API_BASE_URL } from '../requests';
import { Link } from 'react-router-dom';
import MovieModal from './MovieModal';
import Typed from 'typed.js'

const Banner = () => {

  const [movie, setMovie] = useState()
  const [OMDBMovieInfo, setOMDBMovieInfo] = useState(null)
  const [videos, setVideos] = useState(null)
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true)
  const overviewRef = useRef(null)
  const typedRef = useRef(null)
  

  useEffect(() => {
    const fetchFromAPI = async () => {
      const response = await axios.get(`${API_BASE_URL}${requests.fetchNetflixOriginals.url}`)
      console.log(response)
      setMovie(response.data.results[
        Math.floor(Math.random() * response.data.results.length - 1)
      ])
      setLoading(false)
    }

    fetchFromAPI()
  }, [])

  useEffect(() => {
    if (!loading) {
      const options = {
        strings: [movie.overview],
        typeSpeed: 20,
        startDelay: 300,
        showCursor: false
      }
  
      typedRef.current = new Typed(overviewRef.current, options) 

      return () => {
        typedRef.current.destroy()
      }
    }

  }, [loading, movie])

  const handleClose = () => {
    setOMDBMovieInfo(null)
    setVideos(null)
    setShow(false)
  };

  const handleShow = async () => {
    await getAndSetOMDBData()
    setLoading(false)
    setShow(true)

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
    try {
      const movieData = await fetchMovieFromOMDB()
      if (movieData.Error) {
        return
      }

      const videoData = await getVideos(movieData)
      setOMDBMovieInfo(movieData)
      setVideos(videoData)
    } catch (err) {
      console.log(err)
    }
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

  console.log(movie)



  return (
    loading ? <div>Loading...</div> : (
      <div>
        <div
          style={{
            backgroundSize: 'cover',
            backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
            backgroundPosition: 'center center'
          }}
          className="vw-100 vh-100 d-flex align-items-center"
        >
          <div className="px-5 w-50">
            <div className="fs-1 fw-bold mb-2">{movie.title || movie.name}</div>
            <div className="fs-5 fw-light mb-2" ref={overviewRef}></div>
            <div className="d-flex">
              <div className="btn btn-light me-2 fw-bold d-flex align-items-center" onClick={handleShow}>
                <div className="bi-play-fill me-2 fs-4" />
                <div className="fs-6">Play</div>
              </div>
              <button type="button" className="btn btn-secondary fw-bold d-flex align-items-center">
                <div className="bi-info-circle me-2 fs-4" />
                <div className="fs-6" onClick={handleShow}>More Info</div>
              </button>
            </div>
          </div>
        </div>
        <div className="fade-effect" />

        {show && !loading ? (
          <MovieModal movie={movie} show={show} handleClose={handleClose} convertMinToHours={convertMinToHours} OMDBMovieInfo={OMDBMovieInfo} videos={videos}/>
        ) : null}
        
      </div>
    )
  )
}

export default Banner
