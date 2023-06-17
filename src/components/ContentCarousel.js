import axios from 'axios';
import React, { useState, useEffect } from 'react';
import SmallMovie from './SmallMovie';
import Carousel from 'react-bootstrap/Carousel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useWindowSize } from '../hooks/useWindowSize';

const getNumOfMoviesShown = (windowSize) => {
  if (windowSize && windowSize.width) {
    if (windowSize.width <= 576) {
      return 2;
    } else if (windowSize.width < 600) {
      return 2;
    } else if (windowSize.width < 768) {
      return 3;
    } else if (windowSize.width <= 992) {
      return 4;
    } else if (windowSize.width <= 1200) {
      return 5;
    } else if (windowSize.width <= 1400) {
      return 5;
    } else if (windowSize.width <= 1600) {
      return 6;
    } else if (windowSize.width <= 1700) {
      return 7;
    } else if (windowSize.width <= 1850) {
      return 7;
    } else if (windowSize.width <= 1920) {
      return 7;
    } else {
      return 8;
    }
  }
};

const ContentCarousel = ({ apiUrl, name, hoveredValue, setHoveredValue }) => {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const windowSize = useWindowSize();
  const [numOfMoviesShown, setNumOfMoviesShown] = useState(getNumOfMoviesShown(windowSize));

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };


  useEffect(() => {
    const fetchFromAPI = async () => {
      const response = await axios.get(apiUrl);
      setMovies(response.data.results);
      setLoading(false);
    };
    fetchFromAPI();
  }, [apiUrl]);

  useEffect(() => {
    setLoading(true);
    setNumOfMoviesShown(getNumOfMoviesShown(windowSize));
    setLoading(false);
  }, [windowSize]);

  const getArrayOfNums = (num) => {
    const arrayOfNums = [];
    for (let i = 1; i <= num; i++) {
      arrayOfNums.push(i);
    }
    return arrayOfNums;
  };


  return (
    !loading && (
      <div className="bg-black my-4 px-2 px-lg-4">
        <div className="fs-4">{name} {!['Netflix Originals', 'Documentaries', 'Trending'].includes(name) && 'Movies'}</div>
        <Row>
          <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>

            {getArrayOfNums(20 / numOfMoviesShown).map((currNum) => {
              const currStartIndex = (numOfMoviesShown * (currNum)) - numOfMoviesShown;
              const currEndIndex = currStartIndex + numOfMoviesShown;

              return (
                <Carousel.Item>
                  <Col>
                    <div className="smallMoviesGrid">
                      {movies.slice(currStartIndex, currEndIndex).map((movie) => (
                        <SmallMovie movie={movie} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue} />
                      ))}
                    </div>
                  </Col>
                </Carousel.Item>
              );
            })}

          </Carousel>

        </Row>
      </div>
    )
  );
};

export default ContentCarousel;