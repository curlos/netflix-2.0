import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import requests, { API_BASE_URL } from '../requests';
import { useNavigate } from 'react-router-dom';
import Typed from 'typed.js';
import { Spinner } from 'react-bootstrap';

const Banner = ({ apiLink }) => {

  const [movie, setMovie] = useState();
  const [loading, setLoading] = useState(true);
  const overviewRef = useRef(null);
  const typedRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFromAPI = async () => {
      const response = await axios.get(apiLink ? apiLink : `${API_BASE_URL}${requests.fetchNetflixOriginals.url}`);
      setMovie(response.data.results[
        Math.floor(Math.random() * response.data.results.length - 1)
      ]);
      setLoading(false);
    };

    fetchFromAPI();
  }, [apiLink]);

  useEffect(() => {
    if (!loading && movie && movie.overview) {
      const movieOverview = movie.overview.length > 280 ? movie.overview.slice(0, 280) + '...' : movie.overview;

      const options = {
        strings: [movieOverview],
        typeSpeed: 20,
        startDelay: 300,
        showCursor: false
      };

      typedRef.current = new Typed(overviewRef.current, options);

      return () => {
        typedRef.current.destroy();
      };
    }

  }, [loading, movie]);


  const handleNavigation = () => {
    if (movie.first_air_date) {
      navigate(`/title/tv/${movie.id}`);
    } else {
      navigate(`/title/movie/${movie.id}`);
    }
  };



  return (
    loading ? <div className="spinnerContainer"><Spinner animation="border" variant="danger" /></div> : (
      <div className="bannerContainer">
        <div
          style={{
            backgroundSize: 'cover',
            backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
            backgroundPosition: 'center center'
          }}
          className="vw-100 vh-100 mw-100 d-flex align-items-center"
        >
          <div className="px-3 px-lg-5 w-100">
            <div className="fs-1 fw-bold mb-2">{movie?.title || movie?.name}</div>
            <div className="fs-5 fw-light mb-2" ref={overviewRef}></div>
            <div className="d-flex">
              <div className="btn btn-light me-2 fw-bold d-flex align-items-center">
                <div className="bi-play-fill me-2 fs-4" />
                <div className="fs-6" onClick={handleNavigation}>Play</div>
              </div>
              <button type="button" className="btn btn-secondary fw-bold d-flex align-items-center">
                <div className="bi-info-circle me-2 fs-4" />
                <div className="fs-6" onClick={handleNavigation}>More Info</div>
              </button>
            </div>
          </div>
        </div>
        <div className="fade-effect" />

      </div>
    )
  );
};

export default Banner;
