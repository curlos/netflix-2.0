import React from 'react'
import SmallMovie from '../components/SmallMovie'

const RecommendedMoviesList = ({ recommendedMovies, hoveredValue, setHoveredValue }) => {

  console.log(recommendedMovies)

  return (
    <div className="p-3">
      <div className="fs-4">More Like This</div>

      <div className="container">
        <div className="row">
          {recommendedMovies.results.map((movie) => {
            return (
              <div className="col">
                <SmallMovie movie={movie} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue}/>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RecommendedMoviesList
