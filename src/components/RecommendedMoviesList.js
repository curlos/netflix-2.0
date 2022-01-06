import React, { useState } from 'react'
import SmallMovie from '../components/SmallMovie'

const RecommendedMoviesList = ({ recommendedMovies }) => {

  const [hoveredValue, setHoveredValue] = useState(null)

  console.log(recommendedMovies)

  return (
    recommendedMovies.results.length >= 1 ? 
    (
      <div className="p-3">
        <div className="fs-4">More Like This</div>

        <div className="d-flex flex-wrap gap-2">
          {recommendedMovies.results.map((movie) => {
            return (
              <div className="" key={movie.id}>
                <SmallMovie movie={movie} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue}/>
              </div>
            )
          })}
        </div>
      </div>
    ) : null
  )
}

export default RecommendedMoviesList
