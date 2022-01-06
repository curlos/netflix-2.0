import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import requests, { API_BASE_URL } from '../requests';
import { Link, useNavigate } from 'react-router-dom';
import MovieModal from './MovieModal';
import Typed from 'typed.js'

const TVEpisodeBanner = ({ episode }) => {

  const [show, setShow] = useState(false)
  const overviewRef = useRef(null)
  const typedRef = useRef(null)
  
  const navigate = useNavigate()

  console.log(episode)

  useEffect(() => {
    const options = {
      strings: [episode.overview],
      typeSpeed: 20,
      startDelay: 300,
      showCursor: false
    }

    typedRef.current = new Typed(overviewRef.current, options) 

    return () => {
      typedRef.current.destroy()
    }

  }, [episode])

  // const handleNavigation = () => {
  //   console.log('hello wrold')
  //   if (movie.first_air_date) {
  //     navigate(`/title/tv/${movie.id}`)
  //   } else {
  //     navigate(`/title/movie/${movie.id}`)
  //   }
  // }



  return (
    <div className="bannerContainer">
      <div
        style={{
          backgroundSize: 'cover',
          backgroundImage: `url("https://image.tmdb.org/t/p/original/${episode?.still_path}")`,
          backgroundPosition: 'center center'
        }}
        className="vw-100 vh-100 mw-100 d-flex align-items-center"
      >
        <div className="px-5 w-50">
          <div className="fs-1 fw-bold mb-2">{episode?.name}</div>
          <div className="fs-5 fw-light mb-2" ref={overviewRef}></div>
          <div className="d-flex">
            <div className="btn btn-light me-2 fw-bold d-flex align-items-center">
              <div className="bi-play-fill me-2 fs-4" />
              <div className="fs-6">Play</div>
            </div>
            <button type="button" className="btn btn-secondary fw-bold d-flex align-items-center">
              <div className="bi-info-circle me-2 fs-4" />
              <div className="fs-6">More Info</div>
            </button>
          </div>
        </div>
      </div>
      <div className="fade-effect-less-harsh" />

      {/* {show && !loading ? (
        <MovieModal movie={movie} show={show} handleClose={handleClose} convertMinToHours={convertMinToHours} OMDBMovieInfo={OMDBMovieInfo} videos={videos}/>
      ) : null} */}
      
    </div>
  )
}

export default TVEpisodeBanner
