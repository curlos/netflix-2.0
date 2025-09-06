import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import SmallMovie from './SmallMovie';
import TopNavbar from './TopNavbar';
import Banner from './Banner';
import CustomPagination from './CustomPagination';
import Dropdown from 'react-bootstrap/Dropdown';
import { YEARS, SORT_TYPES_MOVIE, SORT_TYPES_TV } from '../utils/genres';
import { Spinner } from 'react-bootstrap';

/**
 * @description - Generic browse page component for Movies and TV Shows
 * @param {string} title - Page title ("Movies" or "TV Shows")
 * @param {Array} genres - Genre options (MOVIE_GENRES or TV_GENRES)
 * @param {Object} bannerQuery - RTK Query result for banner data
 * @param {Function} useContentQuery - RTK Query hook for filtered content
 * @param {string} paginationClassName - Optional extra classes for pagination
 * @returns {React.FC}
 */
const BrowsePage = ({ title, genres: genreOptions, bannerQuery, useContentQuery, paginationClassName = "" }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hoveredValue, setHoveredValue] = useState();
  
  // Parse genres from URL params
  const genreParams = searchParams.get('genres');
  const genres = Object.fromEntries(
    genreOptions.map(genre => [
      genre.name, 
      genreParams ? genreParams.split(',').includes(genre.name) : false
    ])
  );

  const selectedYear = parseInt(searchParams.get('year')) || new Date().getFullYear();
  const selectedSortType = searchParams.get('sort') || 'popularity.desc';
  const pageNum = parseInt(searchParams.get('page')) || 1;
  
  const isInitialRender = useRef(true);
  
  // RTK Query for filtered content
  const { data: contentData, isLoading } = useContentQuery({
    genres,
    selectedYear,
    selectedSortType,
    pageNum
  });
  
  const moviesOrTvShows = contentData?.results || [];
  const totalPages = contentData?.total_pages || 0;
  const totalResults = contentData?.total_results || 0;
  
  const SORT_TYPES = title === "Movies" ? SORT_TYPES_MOVIE : SORT_TYPES_TV;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      // If there are filters in URL on initial load, scroll to page title
      const hasFilters = searchParams.get('genres') || 
                        searchParams.get('year') || 
                        searchParams.get('sort') || 
                        searchParams.get('page');
      
      if (hasFilters) {
        const pageTitleElement = document.getElementById("pageTitle");
        if (pageTitleElement) {
          const offsetPosition = pageTitleElement.offsetTop;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
      return;
    }
    
    const pageTitleElement = document.getElementById("pageTitle");
    if (pageTitleElement) {
      const offsetPosition = pageTitleElement.offsetTop;
      
      pageTitleElement.scrollTo({
        block: 'end',
        behavior: 'smooth'
      });
    }
  }, [genres, selectedYear, selectedSortType, pageNum, searchParams]);


  return (
    <div className="bg-black pb-3">
      <TopNavbar />
      <Banner data={bannerQuery.data} isLoading={bannerQuery.isLoading} />

      <div className="pt-5 text-white container mx-auto px-3 px-sm-0">
        <div id="pageTitle" className="py-3 fw-bold fs-4 flex align-items-center">
          {title}
        </div>

        <div className="py-2 d-flex gap-2 dropdownsContainer">
          <Dropdown>
            <Dropdown.Toggle variant="transparent text-white d-flex align-items-center gap-1 border-0 bg-secondary" id="dropdown-basic" className="p-0">
              <div className="">Genre</div>
            </Dropdown.Toggle>

            <Dropdown.Menu variant="dark" align="end">
              <div className="p-2 dropdown-scrollable">
                {Object.keys(genres).map((genre) => {
                  const handleGenreChange = () => {
                    const newSearchParams = new URLSearchParams(searchParams);
                    const currentGenres = genreParams ? genreParams.split(',') : [];
                    
                    if (genres[genre]) {
                      // Remove genre
                      const updatedGenres = currentGenres.filter(g => g !== genre);
                      if (updatedGenres.length === 0) {
                        newSearchParams.delete('genres');
                      } else {
                        newSearchParams.set('genres', updatedGenres.join(','));
                      }
                    } else {
                      // Add genre
                      const updatedGenres = [...currentGenres, genre];
                      newSearchParams.set('genres', updatedGenres.join(','));
                    }
                    
                    newSearchParams.delete('page');
                    setSearchParams(newSearchParams);
                  };

                  return (
                    <div key={genre} className="cursor-pointer" onClick={handleGenreChange}>
                      <input type="checkbox" className="me-1" checked={genres[genre]} onChange={handleGenreChange} />
                      <span>{genre}</span>
                    </div>
                  );
                })}
              </div>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle variant="transparent text-white d-flex align-items-center gap-1 border-0 bg-secondary" id="dropdown-basic" className="p-0">
              <div className="">Year</div>
            </Dropdown.Toggle>

            <Dropdown.Menu variant="dark" align="end">
              <div className="p-2 dropdown-scrollable">
                {YEARS.map((year) => {
                  const handleYearChange = () => {
                    const newSearchParams = new URLSearchParams(searchParams);
                    if (year === new Date().getFullYear()) {
                      newSearchParams.delete('year');
                    } else {
                      newSearchParams.set('year', year.toString());
                    }
                    newSearchParams.delete('page');
                    setSearchParams(newSearchParams);
                  };

                  return (
                    <div key={year} className="cursor-pointer" onClick={handleYearChange}>
                      <input type="radio" name="year-option" className="me-1" checked={selectedYear === year} onChange={handleYearChange} />
                      <span>{year}</span>
                    </div>
                  );
                })}
              </div>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle variant="transparent text-white d-flex align-items-center gap-1 border-0" id="dropdown-basic" className="p-0">
              <div className="">Sort</div>
            </Dropdown.Toggle>

            <Dropdown.Menu variant="dark" align="end">
              <div className="p-2 dropdown-scrollable">
                {Object.keys(SORT_TYPES).map((sortType) => {
                  const handleSortChange = () => {
                    const newSearchParams = new URLSearchParams(searchParams);
                    if (SORT_TYPES[sortType] === 'popularity.desc') {
                      newSearchParams.delete('sort');
                    } else {
                      newSearchParams.set('sort', SORT_TYPES[sortType]);
                    }
                    newSearchParams.delete('page');
                    setSearchParams(newSearchParams);
                  };

                  return (
                    <div key={sortType} className="cursor-pointer" onClick={handleSortChange}>
                      <input type="radio" name="sort-option" className="me-1" checked={SORT_TYPES[sortType] === selectedSortType} onChange={handleSortChange} />
                      <span>{sortType}</span>
                    </div>
                  );
                })}
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        
        {isLoading ? (
          <div className="d-flex justify-content-center py-5 my-5">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : moviesOrTvShows.length === 0 ? (
          <div className="text-center py-5 my-5">
            <div className="fs-2 text-white mb-3">No Results</div>
            <div className="text-lightgray">Try adjusting your filters or search criteria</div>
          </div>
        ) : (
          <div className="smallMoviesGrid">
            {moviesOrTvShows.map((movieOrTvShow) => {
              return <SmallMovie key={movieOrTvShow.id} movie={movieOrTvShow} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue} />;
            })}
          </div>
        )}
      </div>

      <CustomPagination
        currentPage={pageNum}
        totalPages={totalPages}
        totalResults={totalResults}
        onPageChange={(newPage) => {
          const newSearchParams = new URLSearchParams(searchParams);
          if (newPage === 1) {
            newSearchParams.delete('page');
          } else {
            newSearchParams.set('page', newPage.toString());
          }
          setSearchParams(newSearchParams);
        }}
        className={paginationClassName}
      />
    </div>
  );
};

export default BrowsePage;