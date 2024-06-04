const getDestinationIdByName = (destinations, destinationName) => destinations.find(({ name }) => name === destinationName)?.id ?? null;

export { getDestinationIdByName };
