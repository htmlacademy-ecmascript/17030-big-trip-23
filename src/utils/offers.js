const getOffersSetByType = (offers, waypointType) => offers.find(({ type }) => type === waypointType);

const calcOffersPrice = (offers) => offers.reduce((acc, offer) => acc + offer.price, 0);

export {
  getOffersSetByType,
  calcOffersPrice,
};
