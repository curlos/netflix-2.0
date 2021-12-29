import React from 'react'
import SmallMovie from '../components/SmallMovie'

const RecommendedMoviesList = ({ recommendedMovies, hoveredValue, setHoveredValue }) => {

  console.log(recommendedMovies)

  return (
    <div className="p-3">
      <div className="fs-4">More Like This</div>

      <div className="d-flex flex-wrap">
        {recommendedMovies.results.map((movie) => {
          console.log(movie)
          return <SmallMovie movie={movie} hoveredValue={hoveredValue} setHoveredValue={setHoveredValue}/>
        })}
      </div>
    </div>
  )
}

export default RecommendedMoviesList
