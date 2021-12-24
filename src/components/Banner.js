import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import requests, { API_BASE_URL } from '../requests';
import { Link } from 'react-router-dom';
import Typed from 'typed.js'

const Banner = () => {

  const [movie, setMovie] = useState()
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
            <div className="fs-1 fw-bold mb-2">{movie.name}</div>
            <div className="fs-5 fw-light mb-2" ref={overviewRef}>{movie.overview.length > 140 ? movie.overview.slice(0, 140) + '...' : movie.overview}</div>
            <div className="d-flex">
              <Link to={`/title/${movie.id}`} className="btn btn-light me-2 fw-bold d-flex align-items-center">
                <div className="bi-play-fill me-2 fs-4" />
                <div className="fs-6">Play</div>
              </Link>
              <button type="button" className="btn btn-secondary fw-bold d-flex align-items-center">
                <div className="bi-info-circle me-2 fs-4" />
                <div className="fs-6">More Info</div>
              </button>
            </div>
          </div>
        </div>
        <div className="fade-effect" />
        
      </div>
    )
  )
}

export default Banner
