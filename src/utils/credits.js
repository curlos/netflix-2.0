const getAllActors = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Acting')
}

const getAllCostumeAndMakeup = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Costume & Make-up')
}

const getAllProduction = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Production')
}

const getAllArt= (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Art')
}

const getAllSound = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Sound')
}

const getAllCamera = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Camera')
}

const getAllDirecting = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Directing')
}

const getAllCrew = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Crew')
}

const getAllVisualEffects = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Visual Effects')
  
}