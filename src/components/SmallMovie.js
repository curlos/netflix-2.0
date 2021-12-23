import React, { useState, useEffect } from 'react'
import { getGenreNames } from '../utils/genres'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import CloseButton from 'react-bootstrap/CloseButton'
import {
  Link,
  useNavigate
} from "react-router-dom";
import axios from 'axios'

const SmallMovie = ({ movie }) => {
  const [hoveredMovie, setHoveredMovie] = useState(null)
  const genreNames = getGenreNames(movie?.genre_ids, movie.media_type).slice(0, 3)
  const [OMDBMovieInfo, setOMDBMovieInfo] = useState()
  const [videos, setVideos] = useState()

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleClose = () => {
    console.log('hello')
    window.location.href = 'http://localhost:3000/'
    setOMDBMovieInfo(null)
    setVideos(null)
    setShow(false)
  };
  const handleShow = async () => {
    const movieData = await fetchMovieFromOMDB()
    const videoData = await getVideos()
    setOMDBMovieInfo(movieData)
    setVideos(videoData)

    setLoading(false)
    setShow(true)

  };

  const fetchMovieFromOMDB = async () => {
    const response = await axios.get(`http://www.omdbapi.com/?t=${movie.title || movie.name}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`)
    return response.data
  }

  const getVideos = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`)
    return response.data
  }

  if(show) {
    console.log(videos)
  }

  return (
    <Link to={`/title/${movie.id}`} className="smallMovie text-white fs-6" onClick={handleShow}>
      <div>
        <img src={`https://image.tmdb.org/t/p/original${movie?.poster_path}`} alt="" className={`movieImage m-1 rounded`} onMouseEnter={() => setHoveredMovie(movie.id)}
        onMouseLeave={() => setHoveredMovie(null)}
        />
      </div>

      {show && !loading ? (
        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header  
            className="modalImage" 
            style={{
              backgroundImage: `url("https://image.tmdb.org/t/p/original${movie?.backdrop_path}")`,
              backgroundSize: 'cover',
              objectFit: 'cover',
              height: '300px',
              padding: '10px'
            }}
          >
            <div className="closeButtonContainer" onClick={handleClose}>
              <CloseButton variant="white" className="closeButtonModal"/>
            </div>
            
            
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
            <div className="d-flex justify-content-between align-items-center w-100">
              <h3 className="fs-3 m-0">{movie.title || movie.name}</h3>
              

              <div className="d-flex align-items-center">
                {OMDBMovieInfo.imdbRating !== 'N/A' && (
                  <div>
                    <i class="bi bi-star-fill fs-3 text-warning"></i>
                  </div>  
                )}
                <div>
                  {OMDBMovieInfo.imdbRating !== 'N/A' ? (
                    <div>
                      <span>{OMDBMovieInfo.imdbRating}</span>
                      <span className="text-secondary">/10</span> 
                    </div>
                  ) : (
                    <div className="fs-3 d-flex align-items-center">
                      <span>{OMDBMovieInfo.Ratings.length > 0 && OMDBMovieInfo.Ratings[0].Value}</span>
                    </div>
                  )}
                  
                  {OMDBMovieInfo.imdbRating !== 'N/A' && (
                    <div>{OMDBMovieInfo.imdbVotes}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              {OMDBMovieInfo.Runtime !== 'N/A' && (
                <div>{OMDBMovieInfo.Runtime}</div>
              )}
              {OMDBMovieInfo.Year !== 'N/A' && (
                <div>{OMDBMovieInfo.Year}</div>
              )}
              {OMDBMovieInfo.Rated !== 'N/A' && (
                <div>{OMDBMovieInfo.Rated}</div>
              )}
              <div className="smallMovieTag">HD</div>
        
            </div>

            <div className="my-3">{movie.overview}</div>

            {videos && videos.results.length > 0 && (
              videos.results[0].site === 'YouTube' ? `https://www.youtube.com/watch?v=${videos.results[0].key}` : `https://vimeo.com/${videos.results[0].key}`
            )}

            <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videos.results[0].key}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            
            <div className="space-between-x-1">
              <div><span className="text-lightgray">Country:</span> {OMDBMovieInfo.Country}</div>
              <div><span className="text-lightgray">Genres:</span> {OMDBMovieInfo.Genre}</div>
              <div><span className="text-lightgray">Release:</span>  {OMDBMovieInfo.Released}</div>
              <div><span className="text-lightgray">Director:</span> {OMDBMovieInfo.Director}</div>
              <div><span className="text-lightgray">Cast:</span> {OMDBMovieInfo.Actors}</div>
            </div>
          </Modal.Body>
        </Modal>
      ) : null}
    </Link>
  )
}

export default SmallMovie