import React, { useState } from 'react'
import SmallMovie from '../components/SmallMovie'

const RecommendedMoviesList = ({ recommendedMovies }) => {

  const [hoveredValue, setHoveredValue] = useState(null)

  console.log(recommendedMovies)

  return (
    <div className="p-3">
      <div className="fs-4">More Like This</div>

      <div className="d-flex flex-wrap recommendedList">
        {recommendedMovies.results.map((movie) => {
          return (
            <div className="" key={movie.id}>
              <SmallMovie movie={movie} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue}/>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecommendedMoviesList
