export const getGenreNames = (genres) => {
  const genreNames = []

  genres.forEach((genre) => {
    genreNames.push(genre.name)
  })

  return genreNames.join(', ')
}