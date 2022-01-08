import React, { useState, useEffect } from 'react'
import {
  useSearchParams,
  useParams,
  useNavigate
} from "react-router-dom";
import axios from 'axios'
import TopNavbar from '../components/TopNavbar'
import TVEpisodeBanner from '../components/TVEpisodeBanner'
import { Spinner } from 'react-bootstrap';


const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const TVEpisode = () => {

  const { id, seasonNum, episodeNum } = useParams()
  const [episode, setEpisode] = useState()
  const [tvShow, setTvShow] = useState()
  const [videos, setVideos] = useState([])
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getAllDetails = async () => {
      setEpisode(await getEpisodeDetails())
      setTvShow(await getTVShow())
      setImages(await getImages())
      setLoading(false)
    }
    getAllDetails()
  }, [episodeNum, id, seasonNum])

  const getEpisodeDetails = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNum}/episode/${episodeNum}?api_key=${API_KEY}&language=en-US`)
    return response.data
  }

  const getTVShow = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`)
    return response.data
  }

  const getVideos = async () => {
    const response = axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNum}/episode/${episodeNum}/videos?api_key=${API_KEY}`)
    
    return response.data
  }

  const getImages = async () => {
    const response = axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNum}/episode/${episodeNum}/images?api_key=${API_KEY}`)
    
    return response.data
  }

  useEffect(() => {
    window.scrollTo(0,0)
  }, [id])

  return (
    loading ? <div className="spinnerContainer"><Spinner animation="border" variant="danger" /></div> : (
      <div>
        <TopNavbar />
        <TVEpisodeBanner tvShow={tvShow} episode={episode}/>
      </div>
    )
  )
}

export default TVEpisode
