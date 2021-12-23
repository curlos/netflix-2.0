import axios from 'axios'
import React, { useState, useEffect } from 'react'
import SmallMovie from './SmallMovie'
import Carousel from 'react-bootstrap/Carousel'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const ContentCarousel = ({ apiUrl, name }) => {
  const [movies, setMovies] = useState([])
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true)

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };


  useEffect(() => {
    const fetchFromAPI = async () => {
      const response = await axios.get(apiUrl)
      setMovies(response.data.results)
      setLoading(false)
    }
    fetchFromAPI()
  }, [apiUrl])

  return (
    !loading && (
      <div className="bg-black my-4 px-4">
        <div className="fs-4">{name} {!['Netflix Originals', 'Documentaries'].includes(name) && 'Movies'}</div>
        <Row>
        <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
          <Carousel.Item>
            <Col>
              <div className="d-flex justify-content-between">
                {movies.slice(0,5).map((movie) => (
                  <SmallMovie movie={movie} />
                ))}
              </div>
            </Col>
          </Carousel.Item>

          <Carousel.Item>
            <Col>
              <div className="d-flex justify-content-between">
                {movies.slice(5,10).map((movie) => (
                  <SmallMovie movie={movie} />
                ))}
              </div>
            </Col>
          </Carousel.Item>

          <Carousel.Item>
            <Col>
              <div className="d-flex justify-content-between">
                {movies.slice(10,15).map((movie) => (
                  <SmallMovie movie={movie} />
                ))}
              </div>
            </Col>
          </Carousel.Item>

          <Carousel.Item>
            <Col>
              <div className="d-flex justify-content-between">
                {movies.slice(15,20).map((movie) => (
                  <SmallMovie movie={movie} />
                ))}
              </div>
            </Col>
          </Carousel.Item>

        </Carousel>
          
        </Row>
      </div>
    )
  )
}

export default ContentCarousel