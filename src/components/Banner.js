import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Typed from 'typed.js';
import { Spinner } from 'react-bootstrap';

/**
 * @description - 
 * @returns {React.FC}
 */
const Banner = ({ data, isLoading }) => {

  const overviewRef = useRef(null);
  const typedRef = useRef(null);

  const navigate = useNavigate();

  // Select most popular movie from provided data
  const movieOrTvShow = (!isLoading && data?.results?.length > 0) 
    ? data.results.reduce((prev, current) => 
        (prev.popularity > current.popularity) ? prev : current
      )
    : null;

  useEffect(() => {
    if (!isLoading && movieOrTvShow && movieOrTvShow.overview) {
      const overview = movieOrTvShow.overview.length > 280 ? movieOrTvShow.overview.slice(0, 280) + '...' : movieOrTvShow.overview;

      const options = {
        strings: [overview],
        typeSpeed: 20,
        startDelay: 300,
        showCursor: false
      };

      typedRef.current = new Typed(overviewRef.current, options);

      return () => {
        typedRef.current.destroy();
      };
    }

  }, [isLoading, movieOrTvShow]);

  const handleNavigation = () => {
    if (movieOrTvShow.first_air_date) {
      navigate(`/title/tv/${movieOrTvShow.id}`);
    } else {
      navigate(`/title/movie/${movieOrTvShow.id}`);
    }
  };

  return (
    isLoading ? <div className="spinnerContainer"><Spinner animation="border" variant="danger" /></div> : (
      <div className="bannerContainer">
        <div
          style={{
            backgroundSize: 'cover',
            backgroundImage: `url("https://image.tmdb.org/t/p/original/${movieOrTvShow?.backdrop_path}")`,
            backgroundPosition: 'center center'
          }}
          className="vw-100 vh-100 mw-100 d-flex align-items-center"
        >
          <div className="w-100 container mx-auto px-3 px-sm-0">
            <div className="fs-1 fw-bold mb-2">{movieOrTvShow?.title || movieOrTvShow?.name}</div>
            <div className="fs-5 fw-light mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }} ref={overviewRef}></div>
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
