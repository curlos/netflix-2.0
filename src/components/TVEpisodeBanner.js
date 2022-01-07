import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import requests, { API_BASE_URL } from '../requests';
import { Link, useNavigate } from 'react-router-dom';
import MovieModal from './MovieModal';
import Typed from 'typed.js'
import moment from 'moment'

const TVEpisodeBanner = ({ tvShow, episode }) => {

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



  return (
    <div className="bannerContainer">
      <div
        style={{
          backgroundSize: 'cover',
          backgroundImage: `url("https://image.tmdb.org/t/p/original/${episode?.still_path}")`,
          backgroundPosition: 'center center'
        }}
        className="vw-100 vh-100 mw-100 d-flex justify-content-center"
      >
        <div className="px-5 tvEpisodeBannerInfo">
          <Link to={`/title/tv/${tvShow.id}`}>
            <i class="bi bi-chevron-left"></i> 
            <span className="ms-2">{tvShow.name || tvShow.original_name}</span>
          </Link>
          <div className="fs-1 fw-bold mb-2 d-flex justify-content-between">
            <span>{episode?.name}</span>
            <div className="space-between-x-1">
              <span className="me-1">
                <i className="bi bi-star-fill fs-6 text-warning"></i>
              </span>
              <span>
                <span>{Math.round((episode?.vote_average + Number.EPSILON) * 100) / 100}</span>
                <span className="text-secondary">/10</span>
              </span>
            </div>
          </div>
          <div className=" fw-light mb-2">Episode aired {moment(episode?.air_date).format('MMMM Do, YYYY')}</div>
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
      
    </div>
  )
}

export default TVEpisodeBanner
