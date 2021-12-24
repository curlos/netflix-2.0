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
    const videoData = await getVideos(movieData)
    setOMDBMovieInfo(movieData)
    setVideos(videoData)

    setLoading(false)
    setShow(true)

  };

  const fetchMovieFromOMDB = async () => {
    const response = await axios.get(`http://www.omdbapi.com/?t=${movie.title || movie.name}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`)
    console.log(response.data)
    return response.data
  }

  const getVideos = async (OMDBMovieInfo) => {
    const response = await axios.get(`https://api.themoviedb.org/3/${OMDBMovieInfo.Type === 'movie' ? 'movie' : 'tv'}/${movie.id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`)
    return response.data
  }

  const convertMinToHours = (n) => {
      var num = Number(n);
      var hours = (num / 60);
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
      var rminutes = Math.round(minutes);
      
      return {
        hours: rhours,
        minutes: rminutes
      }
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
          
          <Modal.Body className="bg-dark text-white p-3"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("https://image.tmdb.org/t/p/original${movie?.poster_path}")`,
                backgroundColor: '#343A40',
                backgroundSize: 'cover',
                objectFit: 'cover',
                padding: '10px'
              }}
            >
              <div className="d-flex justify-content-end mb-1">
                <div className="closeButtonContainer" onClick={handleClose}>
                  <CloseButton variant="white" className="closeButtonModal"/>
                </div>
              </div>
              <div className="videoWrapper" style={{}}>
                <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videos.results[0].key}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} loop={true} autoPlay={true} muted={true} className="video-size"></iframe>
              </div>
            
              <div className="d-flex justify-content-between align-items-center w-100">
                <h3 className="fs-3 m-0">{movie.title || movie.name}</h3>
                

                <div className="d-flex align-items-center gap-2">
                  {OMDBMovieInfo.imdbRating !== 'N/A' && (
                    <div>
                      <i className="bi bi-star-fill fs-3 text-warning"></i>
                    </div>  
                  )}
                  <div className="">
                    {OMDBMovieInfo.imdbRating !== 'N/A' ? (
                      <div className="text-center fs-3">
                        <span>{OMDBMovieInfo.imdbRating}</span>
                        <span className="text-secondary">/10</span> 
                      </div>
                    ) : (
                      <div className="fs-2 d-flex align-items-center">
                        <span>{OMDBMovieInfo.Ratings.length > 0 && OMDBMovieInfo.Ratings[0].Value}</span>
                      </div>
                    )}
                    
                    {OMDBMovieInfo.imdbRating !== 'N/A' && (
                      <div className="fs-6 text-secondary text-center">{OMDBMovieInfo.imdbVotes}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                
                {OMDBMovieInfo.Year !== 'N/A' && (
                  <div>{OMDBMovieInfo.Year}</div>
                )}
                {OMDBMovieInfo.Rated !== 'N/A' && (
                  <div className="smallMovieTag">{OMDBMovieInfo.Rated}</div>
                )}
                {OMDBMovieInfo.Type === 'movie' && OMDBMovieInfo.Runtime !== 'N/A' && (
                  <div>
                    <span className="me-1">{convertMinToHours(OMDBMovieInfo.Runtime.split(' ')[0]).hours}H</span>
                    <span>{convertMinToHours(OMDBMovieInfo.Runtime.split(' ')[0]).minutes}M</span>
                  </div>
                )}

                {OMDBMovieInfo.Type === 'series' && OMDBMovieInfo.totalSeasons && OMDBMovieInfo.totalSeasons !== 'N/A' && (
                  <div>
                    <span className="me-1">{OMDBMovieInfo.totalSeasons}</span>
                    <span>{Number(OMDBMovieInfo.totalSeasons) > 1 ? 
                    'Seasons' : 'Season'}</span>
                  </div>
                )}
                <div className="smallMovieTag">HD</div>
          
              </div>

              <div className="my-3">{movie.overview}</div>
              
              
              <div className="space-between-y-1">

                {OMDBMovieInfo.Country && OMDBMovieInfo.Country !== 'N/A' && (
                  <div><span className="text-lightgray">
                    {OMDBMovieInfo.Country.split(',').length > 1 ? 
                    'Countries' : 'Country'}:</span> {OMDBMovieInfo.Country}
                  </div>
                )}

                {OMDBMovieInfo.Language && OMDBMovieInfo.Language !== 'N/A' && (
                  <div><span className="text-lightgray">
                    {OMDBMovieInfo.Language.split(',').length > 1 ? 
                    'Languages' : 'Language'}:</span> {OMDBMovieInfo.Language}
                  </div>
                )}

                {OMDBMovieInfo.Genre && OMDBMovieInfo.Genre !== 'N/A' && (
                  <div><span className="text-lightgray">
                    {OMDBMovieInfo.Genre.split(',').length > 1 ? 
                    'Genres' : 'Genre'}:</span> {OMDBMovieInfo.Genre}
                  </div>
                )}

                {OMDBMovieInfo.Released && OMDBMovieInfo.Released !== 'N/A' && (
                  <div><span className="text-lightgray">Release:</span> {OMDBMovieInfo.Released}</div>
                )}

                {OMDBMovieInfo.Director && OMDBMovieInfo.Director !== 'N/A' && (
                  <div><span className="text-lightgray">
                    {OMDBMovieInfo.Director.split(',').length > 1 ? 
                    'Directors' : 'Director'}:</span> {OMDBMovieInfo.Director}
                  </div>
                )}

                {OMDBMovieInfo.Writer && OMDBMovieInfo.Writer !== 'N/A' && (
                  <div><span className="text-lightgray">
                    {OMDBMovieInfo.Writer.split(',').length > 1 ? 
                    'Writers' : 'Writer'}:</span> {OMDBMovieInfo.Writer}
                  </div>
                )}

                {OMDBMovieInfo.Actors && OMDBMovieInfo.Actors !== 'N/A' && (
                  <div><span className="text-lightgray">Actors:</span> {OMDBMovieInfo.Actors}</div>
                )}

                {OMDBMovieInfo.Awards && OMDBMovieInfo.Awards !== 'N/A' && (
                  <div><span className="text-lightgray">Awards:</span> {OMDBMovieInfo.Awards}</div>
                )}
                
                {OMDBMovieInfo.BoxOffice && OMDBMovieInfo.BoxOffice !== 'N/A' && (
                  <div>
                    <span className="text-lightgray">Box Office:</span> {OMDBMovieInfo.BoxOffice}
                  </div>
                )}
              </div>

            </Modal.Body>
        </Modal>
      ) : null}
    </Link>
  )
}

export default SmallMovie