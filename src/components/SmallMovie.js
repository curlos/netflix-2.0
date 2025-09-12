import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import HoveredMovie from './HoveredMovie';

/**
 * @description - 
 * @returns {React.FC}
 */
const SmallMovie = ({ movie, hoveredValue, setHoveredValue, roleInfo }) => {
  const [_show, setShow] = useState(false);
  const navigate = useNavigate();

  const timeoutIdRef = useRef(null);

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        window.clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
  }, []);

  const showHoveredMovie = (newHoveredMovie) => {
    setHoveredValue(newHoveredMovie);
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleHover = () => {
    if (!timeoutIdRef.current) {
      timeoutIdRef.current = window.setTimeout(() => {
        timeoutIdRef.current = null;
        showHoveredMovie(movie);
      }, 700);
    }
  };

  const handleHoverLeave = () => {
    if (timeoutIdRef.current) {
      window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };


  const handleNavigation = () => {
    if (movie?.media_type === 'person') {
      navigate(`/person/${movie.id}`);
      return;
    }
    
    if (movie.first_air_date || movie.media_type === 'tv') {
      navigate(`/title/tv/${movie.id}`);
    } else {
      navigate(`/title/movie/${movie.id}`);
    }
  };

  const imagePath = movie?.media_type === 'person' ? movie?.profile_path : movie?.poster_path;

  return (
    <div className="flex-1" onClick={handleNavigation}>
      {hoveredValue && hoveredValue === movie && movie?.media_type !== 'person' ? (

        <div className="text-white">
          <HoveredMovie handleShow={handleShow} setHoveredValue={setHoveredValue} movie={movie} />
        </div>

      ) : (
        <div className="smallMovie text-white fs-6" onClick={handleShow} onMouseEnter={handleHover} onMouseLeave={handleHoverLeave}>
          <div className="d-flex flex-column justify-content-between h-100">
            <div >
              {imagePath ? (
                <img src={`https://image.tmdb.org/t/p/original${imagePath}`} alt="" className={`movieImage rounded`} />
              ) : (
                <div className="movieImage rounded d-flex align-items-center justify-content-center text-center p-3" style={{backgroundColor: '#333', aspectRatio: '2/3'}}>
                  <div>
                    <div className="fw-bold mb-2">{movie?.title || movie?.name}</div>
                    <div className="text-muted small">No Image Available</div>
                  </div>
                </div>
              )}
            </div>
            {roleInfo && (
              <div className="px-2 py-1">
                <div className="text-muted small text-center" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                  {roleInfo}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmallMovie;