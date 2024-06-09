const MAX_CITIES_COUNT = 3;
const CITIES_DIVIDER = ' &mdash; ';
const BLANKED_CITY_NAME = '...';

const getDestinationById = (destinations, destinationId) => destinations.find(({ id }) => id === destinationId);

const printCitiesRoutes = (destinations) => {
  const cities = destinations.map(({ name }) => name);
  const citiesCount = cities.length;

  if (citiesCount <= MAX_CITIES_COUNT) {
    return cities.join(CITIES_DIVIDER);
  }

  const firstCity = cities.at(0);
  const lastCity = cities.at(-1);

  return [firstCity, BLANKED_CITY_NAME, lastCity].join(CITIES_DIVIDER);
};

const getDestinationIdByName = (destinations, destinationName) => destinations.find(({ name }) => name === destinationName)?.id ?? null;

export {
  getDestinationById,
  printCitiesRoutes,
  getDestinationIdByName,
};
