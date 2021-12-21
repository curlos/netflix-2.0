import axios from 'axios'
import React, { useState, useEffect } from 'react'
import SmallMovie from './SmallMovie'

const Row = ({ apiUrl, name }) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastMovieIndex, setLastMovieIndex] = useState(4)

  useEffect(() => {
    const fetchFromAPI = async () => {
      const response = await axios.get(apiUrl)
      setMovies(response.data.results)
      setLoading(false)
    }
    fetchFromAPI()
  }, [apiUrl])

  return (
    !loading && (
      <div className="bg-black my-4">
        <div className="fs-4">{name} {!['Netflix Originals', 'Documentaries'].includes(name) && 'Movies'}</div>
        <div className="d-flex bg-transparent">
          {movies.map((movie) => (
            <SmallMovie movie={movie} />
          ))}
        </div>
      </div>
    )
  )
}

export default Row
