import axios from 'axios';
import React, { useState, useEffect } from 'react'
import requests, { API_BASE_URL } from '../requests';

const Banner = () => {

  const [movie, setMovie] = useState()
  const [loading, setLoading] = useState(true)

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
            <div className="fs-5 fw-light mb-2">{movie.overview}</div>
            <div className="d-flex">
              <button type="button" className="btn btn-light me-2 fw-bold d-flex align-items-center">
                <div className="bi-play-fill me-2 fs-4" />
                <div className="fs-6">Play</div>
              </button>
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
