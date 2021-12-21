import React from 'react'

const MovieModal = ({ movie, genreNames }) => {
  return (
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header d-flex justify-content-end align-items-start" style={{
            backgroundImage: `url("https://image.tmdb.org/t/p/original${movie?.backdrop_path}")`,
            backgroundSize: 'cover',
            objectFit: 'cover',
            height: '300px',
            padding: '10px'
          }}>
            <div className="bg-dark p-1 rounded-circle">
              <button type="button" class="btn-close btn-close-white m-0" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
          </div>

          <h5 class="modal-title p-3 fs-2" id="exampleModalLabel">{movie?.title || movie?.name}</h5>

          <div className="ps-3 d-flex">
            <div><i class="bi bi-star-fill me-2"></i></div>
            <div>{movie?.vote_average}</div>
          </div>
          
          <div class="modal-body p-3 text-secondary">
            <div className="text-white mb-2">{movie?.overview}</div>

            <div>
              <span>Release: </span>
              <span className="text-white">{movie?.release_date}</span>
            </div>
            <div>Genre: {genreNames.map((genreName, i) => {
              return (
                <span className="text-white">{genreName + `${i < genreNames.length - 1 ?', ' : ''}`}</span>
              )
            })}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieModal
