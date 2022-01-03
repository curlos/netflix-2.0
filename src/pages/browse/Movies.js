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

  const [filters, setFilters] = useState({
    genres: [...MOVIE_GENRES.map((genre) => {
      return {
        name: genre.name,
        checked: false
      }
    })],
    types: [
      {
        name: 'Movie',
        checked: false
      },
      {
        name: 'TV Show',
        checked: false
      }
    ],
    years: [...YEARS.map((year) => {
      return {
        name: year,
        checked: false
      }
    })],
    sortTypes: [...SORT_TYPES.map((sortType) => {
      return {
        name: sortType,
        checked: false
      }
    })]
  })

  console.log(filters)

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`).then((response) => {
      console.log(response.data)
      setMovies(response.data.results)
      setLoading(false)
    })
  }, [])

  return (
    loading ? <div>Loading...</div> : (
      <div className="bg-black">
        <TopNavbar />
        <Banner apiLink={`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`}/>

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

                  {filters.genres.map((genre) => {
                    return (
                      <div>
                        <input type="checkbox" className="me-1" checked={genre.checked} />
                        <span>{genre.name}</span>
                      </div>
                    ) 
                  })}
                </div>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle variant="transparent text-white d-flex align-items-center gap-1 border-0 bg-secondary" id="dropdown-basic" className="p-0">
                <div className="">Type</div>
              </Dropdown.Toggle>

              <Dropdown.Menu variant="dark" align="end">
                <div className="p-2">
                  <div>
                    <input type="checkbox" className="me-1"/>
                    <span>Movie</span>
                  </div>

                  <div>
                    <input type="checkbox" className="me-1"/>
                    <span>TV Show</span>
                  </div>
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
                        <input type="checkbox" className="me-1"/>
                        <span>{year}</span>
                      </div>
                    )
                  })}
                </div>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle variant="transparent text-white d-flex align-items-center gap-1 border-0 bg-secondary" id="dropdown-basic" className="p-0">
                <div className="">Sort</div>
              </Dropdown.Toggle>

              <Dropdown.Menu variant="dark" align="end">
                <div className="p-2">
                  <div>
                    <input type="checkbox" className="me-1"/>
                    <span>Default</span>
                  </div>

                  <div>
                    <input type="checkbox" className="me-1"/>
                    <span>Most Popular</span>
                  </div>

                  <div>
                    <input type="checkbox" className="me-1"/>
                    <span>Least Popular</span>
                  </div>

                  <div>
                    <input type="checkbox" className="me-1"/>
                    <span>Most Recent</span>
                  </div>

                  <div>
                    <input type="checkbox" className="me-1"/>
                    <span>Least Recent</span>
                  </div>

                  <div>
                    <input type="checkbox" className="me-1"/>
                    <span>Most Revenue</span>
                  </div>

                  <div>
                    <input type="checkbox" className="me-1"/>
                    <span>Least Revenue</span>
                  </div>

                  <div>
                    <input type="checkbox" className="me-1"/>
                    <span>Highest Vote Average</span>
                  </div>

                  <div>
                    <input type="checkbox" className="me-1"/>
                    <span>Lowest Vote Average</span>
                  </div>

                  <div>
                    <input type="checkbox" className="me-1"/>
                    <span>Highest Vote Count</span>
                  </div>

                  <div>
                    <input type="checkbox" className="me-1"/>
                    <span>Lowest Vote Count</span>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="d-flex flex-wrap gap-2 rounded px-5">
            {movies.map((movie) => {
              return <SmallMovie movie={movie} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue}/>
            })}
          </div>
        </div>

        {/* <Pagination>
          <Pagination.First />
          <Pagination.Prev />
          <Pagination.Item>{1}</Pagination.Item>
          <Pagination.Ellipsis />

          <Pagination.Item>{10}</Pagination.Item>
          <Pagination.Item>{11}</Pagination.Item>
          <Pagination.Item active>{12}</Pagination.Item>
          <Pagination.Item>{13}</Pagination.Item>
          <Pagination.Item disabled>{14}</Pagination.Item>

          <Pagination.Ellipsis />
          <Pagination.Item>{20}</Pagination.Item>
          <Pagination.Next />
          <Pagination.Last />
        </Pagination> */}
      </div>
    )
  )
}

export default Movies
