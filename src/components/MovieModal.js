import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import CloseButton from 'react-bootstrap/CloseButton'
import { getGenreNames } from '../utils/genres'
import RecommendedMoviesList from './RecommendedMoviesList'

const MovieModal = ({ movie, details, videos, credits, recommendedMovies, show, handleClose, convertMinToHours, hoveredValue, setHoveredValue }) => {
  const genreNames = getGenreNames(movie?.genre_ids, movie.media_type).slice(0, 3)
  const genreNamesStr = genreNames.join(', ')

  return (
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Body className="bg-dark text-white p-0">
        <div className="d-flex justify-content-end mb-1 p-2">
          <div className="closeButtonContainer" onClick={handleClose}>
            <CloseButton variant="white" className="closeButtonModal"/>
          </div>
        </div>

        {videos && videos.results.length > 1 ? (
          <div className="videoWrapper" style={{}}>
            <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videos.results[0].key}?&autoplay=1&loop=1&start=10`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} loop={true} autoPlay={true} muted={true} className="video-size"></iframe>
          </div>) : (
            <div>
              <img src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path || movie?.poster_path}`} alt="" className="w-100"/>
            </div>
          )
        }
      
        <div
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(33, 37, 42, 0.8), rgba(33, 37, 42, 1)), url("https://image.tmdb.org/t/p/original${movie?.backdrop_path || movie?.poster_path}")`,
            backgroundColor: '#343A40',
            backgroundSize: 'cover',
            objectFit: 'cover',
            padding: '12px',
          }}
        >
          <div className="d-flex justify-content-between align-items-center w-100 mb-2">
            {(movie.title || movie.original_title) ? (
              <h3 className="fs-3 m-0">{movie.title || movie.original_title}</h3>
            ) : null}
            
            {movie?.vote_count > 0 ? (
              <div className="d-flex align-items-center gap-2">
                <div>
                  <i className="bi bi-star-fill fs-3 text-warning"></i>
                </div>
                <div className="">
                  <div className="text-center fs-3">
                    <span>{movie?.vote_average}</span>
                    <span className="text-secondary">/10</span> 
                  </div>
                  
                  <div className="fs-6 text-secondary text-center">{Number(movie?.vote_count).toLocaleString()}</div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="d-flex gap-1 align-items-center">
            <div>{details.release_date ? (new Date(details.release_date).getFullYear()) : null}</div>
            {details.runtime && details.runtime > 0 ? (
              <div className="">{convertMinToHours(details?.runtime).hours}H</div>
            ) : null} 
            {details.runtime && details.runtime > 0 ? (
              <div className="">{convertMinToHours(details?.runtime).minutes}M</div>
            ) : null}
            <div className="smallMovieTag">HD</div>
          </div>

          {movie?.overview ? (
            <div className="my-3">{movie.overview}</div>
          ) : null}
          
          <div className="space-between-y-1">

            {movie.release_date ? (
              <div><span className="text-lightgray">Release:</span> {movie?.release_date}</div>
            ) : null}

            {genreNamesStr ? (
              <div>
                <span className="text-lightgray me-1 span">
                  Genres:
                </span> 
                {genreNamesStr}
              </div>
            ) : null}

            {credits && credits.crew && credits.crew.filter(  (member) => member.job === 'Director').length >= 1 ? (
               <div>
                <span className="text-lightgray me-1 span">
                  Director:
                </span> 
                {credits.crew.filter((member) => member.job === 'Director').map((member) => <span>{member.name}</span>)}
              </div>
            ) : null}

            {credits && credits.cast.length >= 1 ? (
              <div>
                <span className="text-lightgray me-1 span">
                  Cast:
                </span> 
                {credits.cast.slice(0, 3).map((actor, i) => <span>{actor.name}{i !== 2 ? ', ' : null}</span>)}
              </div>
            ) : null}

            {details && details.production_companies.length >= 1 ? (
              <div>
                <span className="text-lightgray me-1 span">
                  Production:
                </span> 
                {details.production_companies.map((company, i) => <span>{company.name}{i !== details.production_companies.length - 1 ? ', ' : null}</span>)}
              </div>
            ) : null}
        </div>

    
        </div>

        {recommendedMovies.total_results ? (
          <div>
            <div className="mb-4"></div>
            <RecommendedMoviesList recommendedMovies={recommendedMovies} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue}/>
          </div>
        ) : null}

      </Modal.Body>
    </Modal>
  )
}

export default MovieModal