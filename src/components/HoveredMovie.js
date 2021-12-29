import React from 'react'
import Card from 'react-bootstrap/Card'
import { getGenreNames } from '../utils/genres'

const HoveredMovie = ({ handleShow, setHoveredValue, setHoveredMovie, movie, details, videos, recommendedMovies, convertMinToHours  }) => {
  const genreNames = getGenreNames(movie?.genre_ids, movie.media_type).slice(0, 3)
  const genreNamesStr = genreNames.join(' • ')

  console.log(movie)
  console.log(details)
  console.log(videos)
  console.log(recommendedMovies)
  console.log(genreNames)

  return (
    <div className="hoveredMovie m-2" onClick={handleShow} onMouseLeave={() => {
      setHoveredValue(null)
      setHoveredMovie(false)
    }}>

      <Card className="p-0 m-0 h-100 border-0 rounded">
      {videos.results.length > 1 ? (
          <div className="videoWrapper" style={{}}>
            <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videos.results[0].key}?&autoplay=1&loop=1&rel=0&controls=0&modestbranding=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} loop={true} autoPlay={true} muted={true} className="video-size"></iframe>
          </div>
        ) : (
          <Card.Img variant="top" src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path || movie?.poster_path}`} alt="" className={`m-0 rounded noBottomBorderRadius`} />
        )}

        
        <Card.Body className="bg-dark cardBody">
          <Card.Title className="d-flex justify-content-between">
            <div className="d-flex">
              <i class="bi bi-play-fill circleIcon me-2 bg-white text-dark border-dark"></i>
              <i class="bi bi-plus circleIcon"></i>
            </div>

            <div>
              <i class="bi bi-chevron-down circleIcon"></i>
            </div>
          </Card.Title>
          <Card.Text>
            <div className="">
              <div className="space-between-x-1">
                <span className="me-1">
                  <i className="bi bi-star-fill fs-6 text-warning"></i>
                </span>
                <span>
                  <span>{movie?.vote_average}</span>
                  <span className="text-secondary">/10</span>
                </span>
              </div>

              <div className="d-flex gap-1 align-items-center">
                <div className="">{convertMinToHours(details?.runtime).hours}H</div> 
                <div>{convertMinToHours(details?.runtime).minutes}M</div>  
                <div className="smallMovieTag">HD</div>
              </div>

              {genreNames ? (
                <div>{genreNamesStr}</div>
              ) : null}
            </div>
            
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}

export default HoveredMovie
