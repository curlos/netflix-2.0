import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import CloseButton from 'react-bootstrap/CloseButton'

const MovieModal = ({ movie, show, handleClose, convertMinToHours, OMDBMovieInfo, videos }) => {  

  return (
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
            <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videos.results[0].key}?&autoplay=1&loop=1&rel=0`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} loop={true} autoPlay={true} muted={true} className="video-size"></iframe>
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
  )
}

export default MovieModal