import React from 'react'
import Card from 'react-bootstrap/Card'

const HoveredMovie = ({ handleShow, setHoveredMovie, movie, OMDBMovieInfo, videos  }) => {

  console.log(OMDBMovieInfo)

  return (
    <div className="hoveredMovie m-2" onClick={handleShow} onMouseLeave={() => setHoveredMovie(false)}>

      <Card className="p-0 m-0 h-100 border-0 rounded">
        {/* <Card.Img variant="top" src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`} alt="" className={`m-0 h-100 rounded noBottomBorderRadius`} /> */}
        <div className="videoWrapper" style={{}}>
          <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videos.results[0].key}?&autoplay=1&loop=1&rel=0`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} loop={true} autoPlay={true} muted={true} className="video-size"></iframe>
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
            {OMDBMovieInfo.Plot}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}

export default HoveredMovie
