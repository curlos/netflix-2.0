import React, { useState, useEffect} from 'react'
import SmallMovie from '../../components/SmallMovie'
import TopNavbar from '../../components/TopNavbar'
import axios from 'axios'
import Banner from '../../components/Banner'
import Dropdown from 'react-bootstrap/Dropdown'
import Pagination from 'react-bootstrap/Pagination'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { MOVIE_GENRES, YEARS, SORT_TYPES } from '../../utils/genres'

const API_KEY = process.env.REACT_APP_TMDB_API_KEY

const Movies = () => {

  const [movies, setMovies] = useState()
  const [hoveredValue, setHoveredValue] = useState()
  const [loading, setLoading] = useState(true)

  const [genres, setGenres] = useState(Object.fromEntries(
    MOVIE_GENRES.map(genre => [genre.name, false])
  ))

  const [selectedYear, setSelectedYear] = useState(2021)
  const [selectedSortType, setSelectedSortType] = useState('popularity.desc')
  const [pageNum, setPageNum] = useState(1)


  useEffect(() => {
    if (document.getElementById("pageTitle")) {
      document.getElementById("pageTitle").scrollIntoView();
    }

    const getIncludedGenresString = () => {
      const genresArr = []
  
      Object.keys(genres).forEach((genreName) => {
        if (genres[genreName]) {
          const movieGenreObj = MOVIE_GENRES.find(genre => genre.name === genreName)
          genresArr.push(movieGenreObj.id)
        }
      })
  
      return genresArr.join(',')
    }

    const includedGenres = getIncludedGenresString()
    
    axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${pageNum}&first_air_date_year=${selectedYear}&sort_by=${selectedSortType}${includedGenres ? `&with_genres=${includedGenres}` : '' }`).then((response) => {
      console.log(response.data)
      setMovies(response.data.results)
      setLoading(false)
    })
  }, [genres, selectedYear, selectedSortType, pageNum])

  

  const getArrayOfNums = (num) => {
    const arrayOfNums = []
    for (let i = 1; i <= num; i++) {
      arrayOfNums.push(i)
    }
    return arrayOfNums
  }

  console.log(genres)

  const handleGenreClick = (genreName) => {
    setGenres({...genres, [genreName]: !genres[genreName]})
  }
  

  return (
    loading ? <div>Loading...</div> : (
      <div className="bg-black">
        <TopNavbar />
        <Banner apiLink={`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&page=1`}/>

        <div className="pt-5 text-white">
          <div id="pageTitle" className="px-2 px-md-5 py-3 fw-bold fs-4 flex align-items-center">
            TV Shows
          </div>

          <div className="px-2 px-md-5 py-2 d-flex gap-2 dropdownsContainer">
            <Dropdown>
              <Dropdown.Toggle variant="transparent text-white d-flex align-items-center gap-1 border-0 bg-secondary" id="dropdown-basic" className="p-0">
                <div className="">Genre</div>
              </Dropdown.Toggle>

              <Dropdown.Menu variant="dark" align="end">
                <div className="p-2">

                  {Object.keys(genres).map((genre) => {
                    return (
                      <div>
                        <input type="checkbox" className="me-1" checked={genres[genre]} onClick={() => handleGenreClick(genre)}/>
                        <span>{genre}</span>
                      </div>
                    ) 
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
                      <div className="">
                        <input type="radio" name="year-option" className="me-1" onClick={() => setSelectedYear(year)}/>
                        <span>{year}</span>
                      </div>
                    )
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
                      <div className="">
                        <input type="radio" name="sort-option" className="me-1" checked={SORT_TYPES[sortType] === selectedSortType} onClick={() => setSelectedSortType(SORT_TYPES[sortType])} />
                        <span>{sortType}</span>
                      </div>
                    )
                  })}
                  
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="smallMoviesGrid px-2 px-md-5">
            {movies.map((movie) => {
              return <SmallMovie movie={movie} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue}/>
            })}
          </div>
        </div>

        <Pagination className="px-2 px-md-5 py-4 d-flex justify-content-center">
          <Pagination.First onClick={() => setPageNum(1)}/>
          <Pagination.Prev onClick={() => setPageNum(pageNum - 1)}/>
          {getArrayOfNums(500).slice(pageNum - 1, (pageNum - 1) + 5).map((num) => {

            if (num === 999) {
              return (
                <span>
                  <Pagination.Item onClick={() => setPageNum(num)} className={`${pageNum === num ? 'selectedPageNum' : null}`}>{num}</Pagination.Item>
                </span>
              )
            }
            
            return (
              <Pagination.Item onClick={() => setPageNum(num)}>{num}</Pagination.Item>
            )
          })}


          <Pagination.Ellipsis />
          <Pagination.Next onClick={() => setPageNum(pageNum + 1)} />
          <Pagination.Last onClick={() => setPageNum(1000)}/>
        </Pagination>
      </div>
    )
  )
}

export default Movies
