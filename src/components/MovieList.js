import React, { useState } from 'react';
import SmallMovie from './SmallMovie';

/**
 * @description - 
 * @returns {React.FC}
 */
const MovieList = ({ movies, query, totalResults }) => {
  const [hoveredValue, setHoveredValue] = useState(null);

  return (
    <div className="navbarMargin text-white">
      <div className="px-3 px-lg-5 py-3 fw-bold fs-4 flex align-items-center">{query} ({totalResults.total_results})</div>
      <div className="smallMoviesGrid px-3 px-lg-5">
        {movies.map((movie) => {
          return <SmallMovie movie={movie} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue} />;
        })}
      </div>
    </div>
  );
};

export default MovieList;
