export const getAllActors = (credits) => {
  return credits.cast
    .filter((cast) => cast.known_for_department === 'Acting')
    .slice(0, 3);
};

export const getAllCostumeAndMakeup = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Costume & Make-up');
};

export const getAllProduction = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Production');
};

export const getAllArt = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Art');
};

export const getAllSound = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Sound');
};

export const getAllCamera = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Camera');
};

export const getAllDirectors = (credits) => {
  return credits.crew.filter((member) => member.job === 'Director');
};

export const getAllCrew = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Crew');
};

export const getAllVisualEffects = (credits) => {
  return credits.cast.filter((cast) => cast.known_for_department === 'Visual Effects');
};