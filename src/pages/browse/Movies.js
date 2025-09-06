import React, { useState, useEffect, useRef } from 'react';
import SmallMovie from '../../components/SmallMovie';
import TopNavbar from '../../components/TopNavbar';
import Banner from '../../components/Banner';
import Dropdown from 'react-bootstrap/Dropdown';
import Pagination from 'react-bootstrap/Pagination';
import { MOVIE_GENRES, YEARS, SORT_TYPES } from '../../utils/genres';
import { Spinner } from 'react-bootstrap';
import { useGetPopularMoviesQuery, useGetFilteredMoviesQuery } from '../../services/movieApi';

/**
 * @description - Page that shows a list of movies and several, several pages of them. There are options to filter and sort the movies.
 * @returns {React.FC}
 */
const Movies = () => {

  const [hoveredValue, setHoveredValue] = useState();
  
  const [genres, setGenres] = useState(Object.fromEntries(
    MOVIE_GENRES.map(genre => [genre.name, false])
  ));

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSortType, setSelectedSortType] = useState('popularity.desc');
  const [pageNum, setPageNum] = useState(1);
  
  const isInitialRender = useRef(true);
  
  // RTK Query for Banner data
  const popularMoviesQuery = useGetPopularMoviesQuery();
  
  // RTK Query for filtered movies
  const { data: moviesData, isLoading } = useGetFilteredMoviesQuery({
    genres,
    selectedYear,
    selectedSortType,
    pageNum
  });
  
  const movies = moviesData?.results || [];

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    if (document.getElementById("pageTitle")) {
      document.getElementById("pageTitle").scrollIntoView();
    }
  }, [genres, selectedYear, selectedSortType, pageNum]);

  /**
   * @description - Using a base num, fill an array with nums from 1 to num
   * @param {Number} num 
   * @returns {Array<Number>}
   */
  const getArrayOfNums = (num) => {
    const arrayOfNums = [];
    for (let i = 1; i <= num; i++) {
      arrayOfNums.push(i);
    }
    return arrayOfNums;
  };

  return (
    isLoading || !movies.length ? <div className="spinnerContainer pb-3"><Spinner animation="border" variant="danger" /></div> : (
      <div className="bg-black pb-3">
        <TopNavbar />
        <Banner data={popularMoviesQuery.data} isLoading={popularMoviesQuery.isLoading} />

        <div className="pt-5 text-white container mx-auto px-3 px-sm-0">
          <div id="pageTitle" className="py-3 fw-bold fs-4 flex align-items-center">
            Movies
          </div>

          <div className="py-2 d-flex gap-2 dropdownsContainer">
            {/* Filter by genre */}
            <Dropdown>
              <Dropdown.Toggle variant="transparent text-white d-flex align-items-center gap-1 border-0 bg-secondary" id="dropdown-basic" className="p-0">
                <div className="">Genre</div>
              </Dropdown.Toggle>

              <Dropdown.Menu variant="dark" align="end">
                <div className="p-2">

                  {Object.keys(genres).map((genre) => {
                    return (
                      <div key={genre}>
                        <input type="checkbox" className="me-1" checked={genres[genre]} onChange={() => setGenres({ ...genres, [genre]: !genres[genre] })} />
                        <span>{genre}</span>
                      </div>
                    );
                  })}
                </div>
              </Dropdown.Menu>
            </Dropdown>

            {/* Filter by year (s) */}
            <Dropdown>
              <Dropdown.Toggle variant="transparent text-white d-flex align-items-center gap-1 border-0 bg-secondary" id="dropdown-basic" className="p-0">
                <div className="">Year</div>
              </Dropdown.Toggle>

              <Dropdown.Menu variant="dark" align="end">
                <div className="p-2">

                  {YEARS.map((year) => {
                    return (
                      <div key={year} className="">
                        <input type="radio" name="year-option" className="me-1" checked={selectedYear === year} onChange={() => setSelectedYear(year)} />
                        <span>{year}</span>
                      </div>
                    );
                  })}
                </div>
              </Dropdown.Menu>
            </Dropdown>

            {/* Sort by different categories like most popular and highest grossing at the box office */}
            <Dropdown>
              <Dropdown.Toggle variant="transparent text-white d-flex align-items-center gap-1 border-0" id="dropdown-basic" className="p-0">
                <div className="">Sort</div>
              </Dropdown.Toggle>

              <Dropdown.Menu variant="dark" align="end">
                <div className="p-2">

                  {Object.keys(SORT_TYPES).map((sortType) => {
                    return (
                      <div key={sortType} className="">
                        <input type="radio" name="sort-option" className="me-1" checked={SORT_TYPES[sortType] === selectedSortType} onChange={() => setSelectedSortType(SORT_TYPES[sortType])} />
                        <span>{sortType}</span>
                      </div>
                    );
                  })}

                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="smallMoviesGrid">
            {movies.map((movie) => {
              return <SmallMovie key={movie.id} movie={movie} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue} />;
            })}
          </div>
        </div>

        <Pagination className="px-2 px-md-5 py-4 d-flex justify-content-center">
          <Pagination.First onClick={() => setPageNum(1)} />
          <Pagination.Prev onClick={() => setPageNum(pageNum - 1)} />
          {getArrayOfNums(500).slice(pageNum - 1, (pageNum - 1) + 5).map((num) => {

            if (num === 999) {
              return (
                <span key={num}>
                  <Pagination.Item onClick={() => setPageNum(num)} className={`${pageNum === num ? 'selectedPageNum' : null}`}>{num}</Pagination.Item>
                </span>
              );
            }

            return (
              <Pagination.Item key={num} onClick={() => setPageNum(num)}>{num}</Pagination.Item>
            );
          })}


          <Pagination.Ellipsis />
          <Pagination.Next onClick={() => setPageNum(pageNum + 1)} />
          <Pagination.Last onClick={() => setPageNum(1000)} />
        </Pagination>
      </div>
    )
  );
};

export default Movies;
