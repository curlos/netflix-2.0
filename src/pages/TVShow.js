import React, { useState, useEffect } from 'react'
import {
  useParams
} from "react-router-dom";
import axios from 'axios'
import TopNavbar from '../components/TopNavbar'
import { Spinner } from 'react-bootstrap';
import { getGenreNames } from '../utils/genres_v2'
import { getAllDirectors, getAllActors } from '../utils/credits';
import RecommendedMoviesList from '../components/RecommendedMoviesList'
import Seasons from '../components/Seasons'
import moment from 'moment';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY

const TVShow = () => {
  const { id } = useParams()
  
  const [details, setDetails] = useState()
  const [videos, setVideos] = useState()
  const [credits, setCredits] = useState()
  const [recommendedTVShows, setRecommendedTVShows] = useState()
  const [seasons, setSeasons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0,0)
    getAndSetAllTVShowDetails()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const getAndSetAllTVShowDetails = async () => {
    setLoading(true)
    const newDetails = await getTVShowDetails()
    setDetails(newDetails)
    setVideos(await getVideos())
    setCredits(await getCredits())
    setRecommendedTVShows(await getRecommendedTVShows())
    setSeasons(await getAllSeasons(newDetails))
    setLoading(false)
  }

  const getTVShowDetails = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`)
    return response.data
  }

  const getVideos = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=en-US`)
    return response.data
  }

  const getCredits = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}&language=en-US`)
    return response.data
  }

  const getRecommendedTVShows = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`)
    return response.data
  }

  const getAllSeasons = async (newDetails) => {

    console.log(newDetails)

    let currSeasons = []
    for (let seasonNum = 1; seasonNum <= newDetails.number_of_seasons; seasonNum++) {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${newDetails.id}/season/${seasonNum}?api_key=${API_KEY}`)
      currSeasons.push(response.data)
    }

    return currSeasons
  }

  const getYears = (details) => {
    const startYear = new Date(details.first_air_date).getFullYear()
    const endYear = details.next_episode_to_air === null ? new Date(details.last_air_date).getFullYear() : ''
    return (
      <span>
        <span className="text-lightgray">Year{startYear !== endYear ? 's': ''}: </span>
        <span>{startYear !== endYear ? `${startYear} - ${endYear}` : startYear}</span>
      </span>
    )
  }
 

  return (
    <div className="bg-black navbarMargin  pb-3">
      <TopNavbar />

      {loading ? <div className="spinnerContainer"><Spinner animation="border" variant="danger" /></div> : (
        <div className="moviePageContainer">
          {videos.results.length >= 1 ? 
          (<div className="videoWrapper" style={{}}>
            <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videos.results[0].key}?&autoplay=1&loop=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} loop={true} autoPlay={true} muted={true} className="video-size"></iframe>
          </div>) : (
            <div>
              <img src={`https://image.tmdb.org/t/p/original${details?.backdrop_path || details?.poster_path}`} alt="" className="w-100"/>
            </div>
          )}

          <div className="d-flex gap-4 my-4">
            <div>
              <img src={`https://image.tmdb.org/t/p/original${details?.poster_path || details?.backdrop_path}`} alt="" className="moviePoster"/>
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-center">
                {details.title || details.original_name ? (
                  <div>
                    <h1 className="fw-bold">{details.title || details.name ||  details.original_name}</h1>
                  </div>
                ) : null}

                {details?.vote_count > 0 ? (
                  <div className="d-flex align-items-center gap-2">
                    <div>
                      <i className="bi bi-star-fill fs-3 text-warning"></i>
                    </div>
                    <div className="">
                      <div className="text-center fs-3">
                        <span>{Math.round((details?.vote_average + Number.EPSILON) * 100) / 100}</span>
                        <span className="text-secondary">/10</span> 
                      </div>
                      
                      <div className="fs-6 text-secondary text-center">{Number(details?.vote_count).toLocaleString()}</div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mb-4">{details.overview}</div>

              <div className="space-between-y-1">

                {details.genres && details.genres.length > 0 ? (
                  <div><span className="text-lightgray" style={{width: '100px'}}>Genre:</span> {getGenreNames(details?.genres)}</div>
                ) : null}

                {details.release_date ? (
                  <div><span className="text-lightgray">Release Date:</span> {moment(details?.air_date).format('MMMM Do, YYYY')}</div>
                ) : null}

                {!details.release_date && details.first_air_date && details.last_air_date ? (
                  <div>{getYears(details)}</div>
                ) : null}

                {credits && credits.crew && credits.crew.filter(  (member) => member.job === 'Director').length >= 1 ? (
                  <div>
                    <span className="text-lightgray me-1 span">
                      Director:
                    </span> 
                    <span>{getAllDirectors(credits)}</span>
                  </div>
                ) : null}   

                {details.production_companies && details.production_companies.length > 0 ? (
                  <div>
                    <span className="text-lightgray me-1 span">
                      Production:
                    </span> 
                    {details.production_companies.map((company, i) => <span>{company.name}{i !== details.production_companies.length - 1 ? ', ' : null}</span>)}  
                  </div>
                ) : null}

                {credits.cast && credits.cast.length > 0 ? (
                  <div><span className="text-lightgray">Cast:</span> {getAllActors(credits)}</div>
                ) : null}

                {details.release_date ? (
                  <div><span className="text-lightgray">Box Office:</span> ${Number(details?.revenue).toLocaleString()}</div>
                ) : null}
              </div>
            </div>
          </div>

          <Seasons tvShowID={id} seasons={seasons} />

          <RecommendedMoviesList recommendedMovies={recommendedTVShows} />
        </div>
      )}
    </div>
  )
}

export default TVShow
