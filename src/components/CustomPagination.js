import React, { useState, useEffect } from 'react';
import Pagination from 'react-bootstrap/Pagination';

/**
 * @description - Reusable pagination component with responsive design and results counter
 * @param {number} currentPage - Current active page number
 * @param {number} totalPages - Total number of pages
 * @param {number} totalResults - Total number of results
 * @param {Function} onPageChange - Callback function when page changes
 * @param {string} className - Optional extra classes for pagination container
 * @param {number} resultsPerPage - Results shown per page (default: 20)
 * @returns {React.FC}
 */
const CustomPagination = ({ currentPage, totalPages, totalResults, onPageChange, className = "", resultsPerPage = 20 }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getArrayOfNums = (num) => {
    const arrayOfNums = [];
    for (let i = 1; i <= num; i++) {
      arrayOfNums.push(i);
    }
    return arrayOfNums;
  };

  const getVisiblePages = () => {
    if (windowWidth < 576) {
      return getArrayOfNums(totalPages).slice(Math.max(0, currentPage - 1), currentPage + 2);
    }
    else if (windowWidth < 768) {
      return getArrayOfNums(totalPages).slice(Math.max(0, currentPage - 2), currentPage + 3);
    }
    else if (windowWidth < 992) {
      return getArrayOfNums(totalPages).slice(Math.max(0, currentPage - 3), currentPage + 4);
    }
    else {
      return getArrayOfNums(totalPages).slice(Math.max(0, currentPage - 4), currentPage + 5);
    }
  };

  const startResult = totalResults > 0 ? ((currentPage - 1) * resultsPerPage) + 1 : 0;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <>
      {totalResults > 0 && (
        <div className="py-2 container mx-auto px-3 px-md-0 text-center text-white mt-3 mb-2">
          <div>
            Showing <strong>{startResult.toLocaleString()}</strong> to <strong>{endResult.toLocaleString()}</strong> of <strong>{totalResults.toLocaleString()}</strong> results
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className={`pb-3 container mx-auto d-flex justify-content-center ${className}`}>
          <Pagination>
            <Pagination.First 
              onClick={() => onPageChange(1)} 
              disabled={currentPage === 1}
            />
            <Pagination.Prev 
              onClick={() => onPageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            />
            {getVisiblePages().map((num) => (
              <Pagination.Item 
                key={num} 
                onClick={() => onPageChange(num)} 
                active={currentPage === num}
              >
                {num}
              </Pagination.Item>
            ))}
            <Pagination.Next 
              onClick={() => onPageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
            />
            <Pagination.Last 
              onClick={() => onPageChange(totalPages)} 
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </>
  );
};

export default CustomPagination;