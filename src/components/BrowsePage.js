import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import SmallMovie from './SmallMovie';
import TopNavbar from './TopNavbar';
import Banner from './Banner';
import CustomPagination from './CustomPagination';
import Dropdown from 'react-bootstrap/Dropdown';
import { YEARS, SORT_TYPES_MOVIE, SORT_TYPES_TV, MOVIE_GENRES, TV_GENRES } from '../utils/genres';
import { useGetFilteredMediaQuery } from '../services/mediaApi';
import { useGetPopularMoviesQuery } from '../services/movieApi';
import { useGetDiscoverTVQuery } from '../services/tvApi';

/**
 * @description - Skeleton loader for movie cards
 */
const SkeletonMovie = () => (
  <div 
    className="bg-secondary rounded" 
    style={{ 
      aspectRatio: '2/3', 
      minHeight: '300px',
      opacity: '0.7',
      animation: 'pulse 2s infinite'
    }}
  ></div>
);

/**
 * @description - Skeleton grid for loading state
 */
const SkeletonGrid = () => (
  <div className="smallMoviesGrid">
    {Array.from({ length: 20 }, (_, i) => (
      <SkeletonMovie key={i} />
    ))}
  </div>
);

/**
 * @description - Reusable filter badge component
 */
const FilterBadge = ({ label, value, paramKey, searchParams, setSearchParams }) => {
  const handleClear = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(paramKey);
    newSearchParams.delete('page');
    setSearchParams(newSearchParams);
  };

  return (
    <div className="bg-dark rounded p-2 position-relative" style={{ paddingRight: '30px' }}>
      <span className="text-white fs-6">
        <span className="fw-bold">{label}:</span> {value}
      </span>
      <button 
        className="bg-secondary rounded-circle border-0 d-flex align-items-center justify-content-center position-absolute"
        style={{ 
          width: '22px', 
          height: '22px', 
          fontSize: '20px', 
          top: '-10px', 
          right: '-10px' 
        }}
        onClick={handleClear}
      >
        <i className="bi bi-x text-white"></i>
      </button>
    </div>
  );
};

/**
 * @description - Browse page component that handles both Movies and TV Shows based on the current route
 * @returns {React.FC}
 */
const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hoveredValue, setHoveredValue] = useState();
  const location = useLocation();
  
  // Determine content type from route
  const isMovies = location.pathname === '/movies';
  const title = isMovies ? 'Movies' : 'TV Shows';
  const mediaType = isMovies ? 'movie' : 'tv';
  const genreOptions = isMovies ? MOVIE_GENRES : TV_GENRES;
  const paginationClassName = isMovies ? 'px-2 px-md-5' : '';
  
  // Get appropriate banner query based on content type
  const moviesBannerQuery = useGetPopularMoviesQuery(undefined, { skip: !isMovies });
  const tvBannerQuery = useGetDiscoverTVQuery(undefined, { skip: isMovies });
  const bannerQuery = isMovies ? moviesBannerQuery : tvBannerQuery;
  
  // Parse genres from URL params - memoized to prevent unnecessary recalculations
  const genreParams = searchParams.get('genres');
  const genres = useMemo(() => Object.fromEntries(
    genreOptions.map(genre => [
      genre.name, 
      genreParams ? genreParams.split(',').includes(genre.name) : false
    ])
  ), [genreOptions, genreParams]);

  const selectedYear = searchParams.get('year') || new Date().getFullYear().toString();
  const selectedSortType = searchParams.get('sort') || 'popularity.desc';
  const pageNum = parseInt(searchParams.get('page')) || 1;
  
  const isInitialRender = useRef(true);
  const previousFilters = useRef({ genres: {}, selectedYear: null, selectedSortType: null, pageNum: null });
  
  // RTK Query for filtered content using unified API
  const { data: contentData, isFetching } = useGetFilteredMediaQuery({
    mediaType,
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
    // Only scroll to top if there are no filters (clean page load)
    const hasFilters = searchParams.get('genres') || 
                      searchParams.get('year') || 
                      searchParams.get('sort') || 
                      searchParams.get('page');
    
    if (!hasFilters) {
      window.scrollTo(0, 0);
    }
  }, [title, searchParams]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      previousFilters.current = { genres, selectedYear, selectedSortType, pageNum };
      
      // If there are filters in URL on initial load, scroll to page title
      const hasFilters = searchParams.get('genres') || 
                        searchParams.get('year') || 
                        searchParams.get('sort') || 
                        searchParams.get('page');
      
      if (hasFilters) {
        setTimeout(() => {
          const pageTitleElement = document.getElementById("pageTitle");
          if (pageTitleElement) {
            const offsetPosition = pageTitleElement.offsetTop - 70;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
      return;
    }
    
    // Check if filters actually changed
    const filtersChanged = 
      JSON.stringify(genres) !== JSON.stringify(previousFilters.current.genres) ||
      selectedYear !== previousFilters.current.selectedYear ||
      selectedSortType !== previousFilters.current.selectedSortType ||
      pageNum !== previousFilters.current.pageNum;
    
    if (filtersChanged) {
      previousFilters.current = { genres, selectedYear, selectedSortType, pageNum };
      
      setTimeout(() => {
        const pageTitleElement = document.getElementById("pageTitle");
        if (pageTitleElement) {
          const offsetPosition = pageTitleElement.offsetTop - 100;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
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

        {/* Applied Filters Section - Reserve space to prevent layout shift */}
        <div>
          {(Object.values(genres).some(Boolean) || selectedYear !== new Date().getFullYear().toString() || selectedSortType !== 'popularity.desc') && (
            <div className="py-2 mb-2">
              <div className="text-white mb-2 fs-6 fw-bold">Applied Filters:</div>
              <div className="d-flex flex-wrap gap-3">
                {/* Genre Filters */}
                {Object.values(genres).some(Boolean) && (
                  <FilterBadge
                    label={Object.values(genres).filter(Boolean).length === 1 ? 'Genre' : 'Genres'}
                    value={Object.entries(genres).filter(([, isSelected]) => isSelected).map(([genre]) => genre).join(', ')}
                    paramKey="genres"
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                  />
                )}
                
                {/* Year Filter */}
                {selectedYear !== new Date().getFullYear().toString() && (
                  <FilterBadge
                    label="Year"
                    value={selectedYear}
                    paramKey="year"
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                  />
                )}
                
                {/* Sort Filter */}
                {selectedSortType !== 'popularity.desc' && (
                  <FilterBadge
                    label="Sort"
                    value={Object.keys(SORT_TYPES).find(key => SORT_TYPES[key] === selectedSortType)}
                    paramKey="sort"
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                  />
                )}
              </div>
            </div>
          )}
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
                    if (year.toString() === new Date().getFullYear().toString()) {
                      newSearchParams.delete('year');
                    } else {
                      newSearchParams.set('year', year.toString());
                    }
                    newSearchParams.delete('page');
                    setSearchParams(newSearchParams);
                  };

                  return (
                    <div key={year} className="cursor-pointer" onClick={handleYearChange}>
                      <input type="radio" name="year-option" className="me-1" checked={selectedYear === year.toString()} onChange={handleYearChange} />
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
        
        <div style={{ minHeight: '400px' }}>
          {isFetching ? (
            <SkeletonGrid />
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