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

/**
 * @description - 
 * @returns {React.FC}
 */
const ContentCarousel = ({ name, movies, isLoading, hoveredValue, setHoveredValue }) => {
  const [index, setIndex] = useState(0);
  const windowSize = useWindowSize();
  const [numOfMoviesShown, setNumOfMoviesShown] = useState(getNumOfMoviesShown(windowSize));

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    setNumOfMoviesShown(getNumOfMoviesShown(windowSize));
  }, [windowSize]);

  const getArrayOfNums = (num) => {
    const arrayOfNums = [];
    for (let i = 1; i <= num; i++) {
      arrayOfNums.push(i);
    }
    return arrayOfNums;
  };


  return (
    !isLoading && (
      <div className="bg-black my-4 px-2 px-lg-4">
        <div className="fs-4">{name} {!['Netflix Originals', 'Documentaries', 'Trending'].includes(name) && 'Movies'}</div>
        <Row>
          <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>

            {getArrayOfNums(20 / numOfMoviesShown).map((currNum) => {
              const currStartIndex = (numOfMoviesShown * (currNum)) - numOfMoviesShown;
              const currEndIndex = currStartIndex + numOfMoviesShown;

              return (
                <Carousel.Item key={currNum}>
                  <Col>
                    <div className="smallMoviesGrid">
                      {movies.slice(currStartIndex, currEndIndex).map((movie) => (
                        <SmallMovie key={movie.id} movie={movie} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue} />
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