import React, { useState, useEffect} from 'react'
import SmallMovie from '../../components/SmallMovie'
import TopNavbar from '../../components/TopNavbar'
import axios from 'axios'
import Banner from '../../components/Banner'
import Dropdown from 'react-bootstrap/Dropdown'
import Pagination from 'react-bootstrap/Pagination'
import { MOVIE_GENRES, YEARS, SORT_TYPES } from '../../utils/genres'

const API_KEY = process.env.REACT_APP_TMDB_API_KEY

const Movies = () => {

  const [movies, setMovies] = useState()
  const [hoveredValue, setHoveredValue] = useState()
  const [loading, setLoading] = useState(true)


  const [genres, setGenres] = useState([
    ...MOVIE_GENRES.map((genre) => {
      return {
        name: genre.name,
        checked: false
      }
  })])

  const [selectedYear, setSelectedYear] = useState(2021)
  const [selectedSortType, setSelectedSortType] = useState('popularity.desc')
  const [pageNum, setPageNum] = useState(0)


  useEffect(() => {
    
    axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=1&primary_release_year=${selectedYear}&sort_by=${selectedSortType}`).then((response) => {
      console.log(response.data)
      setMovies(response.data.results)
      setLoading(false)
    })
  }, [genres, selectedYear, selectedSortType])

  console.log(movies)
  

  return (
    loading ? <div>Loading...</div> : (
      <div className="bg-black">
        <TopNavbar />
        <Banner apiLink={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&page=1`}/>

        <div className="pt-5 text-white">
          <div className="px-5 py-3 fw-bold fs-4 flex align-items-center">
            Movies
          </div>

          <div className="px-5 py-2 d-flex gap-2">
            <Dropdown>
              <Dropdown.Toggle variant="transparent text-white d-flex align-items-center gap-1 border-0 bg-secondary" id="dropdown-basic" className="p-0">
                <div className="">Genre</div>
              </Dropdown.Toggle>

              <Dropdown.Menu variant="dark" align="end">
                <div className="p-2">

                  {genres.map((genre) => {
                    return (
                      <div>
                        <input type="checkbox" className="me-1" checked={genre.checked} onClick={() => setGenres('')}/>
                        <span>{genre.name}</span>
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

            <div>Filter</div>
          </div>
          <div className="d-flex flex-wrap gap-2 rounded px-5">
            {movies.map((movie) => {
              return <SmallMovie movie={movie} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue}/>
            })}
          </div>
        </div>

        <Pagination className="px-5 py-4">
          <Pagination.First />
          <Pagination.Prev />
          <Pagination.Item>{1}</Pagination.Item>

          <Pagination.Item>{10}</Pagination.Item>
          <Pagination.Item>{11}</Pagination.Item>
          <Pagination.Item>{12}</Pagination.Item>
          <Pagination.Item>{13}</Pagination.Item>
          <Pagination.Item disabled>{14}</Pagination.Item>

          <Pagination.Ellipsis />
          <Pagination.Item>{20}</Pagination.Item>
          <Pagination.Next />
          <Pagination.Last />
        </Pagination>
      </div>
    )
  )
}

export default Movies
