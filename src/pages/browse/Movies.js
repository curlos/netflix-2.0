import React, { useState, useEffect} from 'react'
import SmallMovie from '../../components/SmallMovie'
import TopNavbar from '../../components/TopNavbar'
import axios from 'axios'
import Banner from '../../components/Banner'

const API_KEY = process.env.REACT_APP_TMDB_API_KEY

const Movies = () => {

  const [movies, setMovies] = useState()
  const [hoveredValue, setHoveredValue] = useState()
  const [loading, setLoading] = useState(true)

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
          <div className="d-flex justify-content-between flex-wrap rounded px-5">
            {movies.map((movie) => {
              return <SmallMovie movie={movie} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue}/>
            })}
          </div>
        </div>
      </div>
    )
  )
}

export default Movies
