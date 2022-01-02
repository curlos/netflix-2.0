export const getAllActors = (credits) => {
  const actors = []

  credits.cast.filter((cast) => cast.known_for_department === 'Acting').slice(0,3).map((actor, i) => {
    actors.push(actor.name)
  })

  return actors.join(', ')
}

export const getAllCostumeAndMakeup = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Costume & Make-up')
}

export const getAllProduction = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Production')
}

export const getAllArt= (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Art')
}

export const getAllSound = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Sound')
}

export const getAllCamera = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Camera')
}

export const getAllDirectors = (credits) => {
  const directorsArr = []
  const directorsObj = credits.crew.filter((member) => member.job === 'Director')
  directorsObj.forEach((director) => {
    directorsArr.push(director.name)
  })
  return directorsArr.join(', ')
}

const getAllCrew = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Crew')
}

const getAllVisualEffects = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Visual Effects')
}