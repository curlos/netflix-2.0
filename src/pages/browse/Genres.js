import React, { useEffect} from 'react'
import axios from 'axios'
import {
  useSearchParams,
  useParams,
  useNavigate
} from "react-router-dom";
import { getGenreName, getGenreID } from '../../utils/genres'
import TopNavbar from '../../components/TopNavbar';

const Genres = () => {
  
  const [searchParams] = useSearchParams()
  
  useEffect(() => {
    if (searchParams.get('genre') === 'tv') {
      axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=REACT_APP_TMDB_API_KEY&language=en-US&page=1`).then((response) => {
        console.log(response.data)
      })
    } else if (searchParams.get('genre') === 'movie') {
      axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=1`).then((response) => {
        console.log(response.data)
      })
    }
    // axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=###&with_genres=${28}`)
  }, [searchParams.get('genre')])

  return (
    <div>
      <TopNavbar />
    </div>
  )
}

export default Genres
