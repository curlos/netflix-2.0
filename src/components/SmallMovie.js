import React, { useState } from 'react'
import { getGenreNames } from '../utils/genres'
import MovieModal from './MovieModal'

const SmallMovie = ({ movie, }) => {
  const [hoveredMovie, setHoveredMovie] = useState(null)
  const genreNames = getGenreNames(movie?.genre_ids, movie.media_type).slice(0, 3)

  console.log(movie)

  return (
    <div className="smallMovie text-white fs-6" data-bs-toggle="modal" data-bs-target="#exampleModal">
      {hoveredMovie && hoveredMovie === movie.id ? (
        <div class="card bg-dark hoveredMovie" onMouseLeave={() => setHoveredMovie(null)}>
          <img src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`} class="card-img-top" alt="..." />
          <div class="card-body">
            <div class="card-title">{movie?.title || movie?.name}</div>
            <p class="card-text">{
              movie?.overview?.length > 140 ? (movie?.overview.slice(0, 140) + '...') : movie?.overview
            }</p>
            <div className="d-flex justify-content-between align-items-center">

              <div>
                <span className="bi-play-fill bg-light text-black fs-5 rounded-circle p-2 me-2" />
                <span className="bi-plus-lg bg-light text-black fs-5 rounded-circle p-2" />
              </div>

              <div>
                <span class="bi-chevron-down bg-light text-black fs-bold fs-5 rounded-circle p-2"></span>
              </div>
            </div>

            <div className="my-3">
              {genreNames.map((genreName, i) => {
                return (
                  <span>
                    {genreName}
                    {i < genreNames.length - 1 ? <i class="bi bi-dot"></i> : null}
                  </span>
                )
              })}
            </div>


          </div>
        </div>
      ) : (
        <div>
          <img src={`https://image.tmdb.org/t/p/original${movie?.poster_path}`} alt="" className={`movieImage m-1 rounded`} onMouseEnter={() => setHoveredMovie(movie.id)}
          onMouseLeave={() => setHoveredMovie(null)}
          />
        </div>
      )}
    </div>
  )
}

export default SmallMovie
