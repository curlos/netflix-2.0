import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import HoveredMovie from './HoveredMovie';

/**
 * @description - 
 * @returns {React.FC}
 */
const SmallMovie = ({ movie, hoveredValue, setHoveredValue }) => {
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
    if (movie.first_air_date) {
      navigate(`/title/tv/${movie.id}`);
    } else {
      navigate(`/title/movie/${movie.id}`);
    }
  };

  return (
    <div className="flex-1" onClick={handleNavigation}>
      {hoveredValue && hoveredValue === movie ? (

        <div className="text-white">
          <HoveredMovie handleShow={handleShow} setHoveredValue={setHoveredValue} movie={movie} />
        </div>

      ) : (
        <div className="smallMovie text-white fs-6" onClick={handleShow} onMouseEnter={handleHover} onMouseLeave={handleHoverLeave}>
          <div>
            {movie?.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/original${movie?.poster_path}`} alt="" className={`movieImage m-1 rounded`} />
            ) : (
              <div className="movieImage m-1 rounded d-flex align-items-center justify-content-center text-center p-3" style={{backgroundColor: '#333', aspectRatio: '2/3'}}>
                <div>
                  <div className="fw-bold mb-2">{movie?.title || movie?.name}</div>
                  <div className="text-muted small">No Image Available</div>
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