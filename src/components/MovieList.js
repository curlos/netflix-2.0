import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SmallMovie from './SmallMovie';
import CustomPagination from './CustomPagination';

/**
 * @description - 
 * @returns {React.FC}
 */
const MovieList = ({ movies, query, totalResults }) => {
  const [hoveredValue, setHoveredValue] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const pageNum = parseInt(searchParams.get('page')) || 1;
  const totalPages = totalResults?.total_pages || 0;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageNum]);

  return (
    <div className="navbarMargin text-white container mx-auto px-3 px-md-0">
      <div className="px-3 px-lg-5 py-3 fw-bold fs-4 flex align-items-center">{query} ({totalResults.total_results})</div>
      {movies.length === 0 ? (
        <div className="px-3 px-lg-5 py-5 text-center">
          <div className="fs-2 text-white mb-2">No results</div>
          <div className="text-muted">Try adjusting your search</div>
        </div>
      ) : (
        <div className="smallMoviesGrid px-3 px-lg-5">
          {movies.map((movie) => {
            return <SmallMovie key={movie.id} movie={movie} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue} />;
          })}
        </div>
      )}
      
      <CustomPagination
        currentPage={pageNum}
        totalPages={totalPages}
        totalResults={totalResults?.total_results || 0}
        onPageChange={(newPage) => {
          const newSearchParams = new URLSearchParams(searchParams);
          if (newPage === 1) {
            newSearchParams.delete('page');
          } else {
            newSearchParams.set('page', newPage.toString());
          }
          setSearchParams(newSearchParams);
        }}
      />
    </div>
  );
};

export default MovieList;
