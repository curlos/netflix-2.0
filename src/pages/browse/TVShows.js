import React, { useState, useEffect, useRef } from 'react';
import SmallMovie from '../../components/SmallMovie';
import TopNavbar from '../../components/TopNavbar';
import Banner from '../../components/Banner';
import Dropdown from 'react-bootstrap/Dropdown';
import Pagination from 'react-bootstrap/Pagination';
import { TV_GENRES, YEARS, SORT_TYPES } from '../../utils/genres';
import { Spinner } from 'react-bootstrap';
import { useGetDiscoverTVQuery, useGetFilteredTVShowsQuery } from '../../services/tvApi';

const TVShows = () => {

  const [hoveredValue, setHoveredValue] = useState();
  
  const [genres, setGenres] = useState(Object.fromEntries(
    TV_GENRES.map(genre => [genre.name, false])
  ));

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSortType, setSelectedSortType] = useState('popularity.desc');
  const [pageNum, setPageNum] = useState(1);
  
  const isInitialRender = useRef(true);
  
  // RTK Query for Banner data
  const discoverTVQuery = useGetDiscoverTVQuery();
  
  // RTK Query for filtered TV shows
  const { data: tvShowsData, isLoading } = useGetFilteredTVShowsQuery({
    genres,
    selectedYear,
    selectedSortType,
    pageNum
  });
  
  const movies = tvShowsData?.results || [];


  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    if (document.getElementById("pageTitle")) {
      document.getElementById("pageTitle").scrollIntoView();
    }
  }, [genres, selectedYear, selectedSortType, pageNum]);



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
        <Banner data={discoverTVQuery.data} isLoading={discoverTVQuery.isLoading} />

        <div className="pt-5 text-white container mx-auto px-3 px-sm-0">
          <div id="pageTitle" className="py-3 fw-bold fs-4 flex align-items-center">
            TV Shows
          </div>

          <div className="py-2 d-flex gap-2 dropdownsContainer">
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

        <Pagination className="py-4 d-flex justify-content-center">
          <Pagination.First onClick={() => setPageNum(1)} />
          <Pagination.Prev onClick={() => setPageNum(pageNum - 1)} />
          {getArrayOfNums(500).slice(pageNum - 1, (pageNum - 1) + 5).map((num) => {

            if (num === 999) {
              return (
                <span key={num}>
                  <Pagination.Item onClick={() => setPageNum(num)} className={``}>{num}</Pagination.Item>
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

export default TVShows;
