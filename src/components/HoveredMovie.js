import React from 'react'
import Card from 'react-bootstrap/Card'

const HoveredMovie = ({ handleShow, setHoveredValue, setHoveredMovie, movie, OMDBMovieInfo, videos, convertMinToHours  }) => {

  console.log(OMDBMovieInfo)

  return (
    <div className="hoveredMovie m-2" onClick={handleShow} onMouseLeave={() => {
      setHoveredValue(null)
      setHoveredMovie(false)
    }}>

      <Card className="p-0 m-0 h-100 border-0 rounded">
        {/* <Card.Img variant="top" src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`} alt="" className={`m-0 h-100 rounded noBottomBorderRadius`} /> */}
        <div className="videoWrapper" style={{}}>
          <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videos.results[0].key}?&autoplay=1&loop=1&rel=0&controls=0&modestbranding=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} loop={true} autoPlay={true} muted={true} className="video-size"></iframe>
        </div>
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
            <div>
              <div className="space-between-x-1">
                {OMDBMovieInfo.imdbRating !== 'N/A' && (
                  <span className="me-1">
                    <i className="bi bi-star-fill fs-6 text-warning"></i>
                  </span>  
                )}
                <span>{OMDBMovieInfo.imdbRating !== 'N/A' ? (OMDBMovieInfo.imdbRating + '/10') : (OMDBMovieInfo.Ratings.length > 0 ? (OMDBMovieInfo.Ratings[0].Value) : null)}</span>
              </div>
              
              <div className="space-between-x-1">
                <span className="smallMovieTag">{OMDBMovieInfo.Rated}</span>
                {OMDBMovieInfo.Type === 'movie' && OMDBMovieInfo.Runtime !== 'N/A' && (
                  <span>
                    <span className="me-1">{convertMinToHours(OMDBMovieInfo.Runtime.split(' ')[0]).hours}H</span>
                    <span>{convertMinToHours(OMDBMovieInfo.Runtime.split(' ')[0]).minutes}M</span>
                  </span>
                )}

                {OMDBMovieInfo.Type === 'series' && OMDBMovieInfo.totalSeasons && OMDBMovieInfo.totalSeasons !== 'N/A' && (
                  <span>
                    <span className="me-1">{OMDBMovieInfo.totalSeasons}</span>
                    <span>{Number(OMDBMovieInfo.totalSeasons) > 1 ? 
                    'Seasons' : 'Season'}</span>
                  </span>
                )}
                <span className="smallMovieTag">HD</span>
              </div>

              <div>{OMDBMovieInfo.Genre.split(',').join(' • ')}</div>
            </div>
            
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}

export default HoveredMovie
