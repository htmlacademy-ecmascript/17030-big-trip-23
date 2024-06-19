const getOffersSetByType = (offers, waypointType) => offers.find(({ type }) => type === waypointType);

const calcOffersPrice = (offers) => offers.reduce((sum, offer) => sum + offer.price, 0);

export {
  getOffersSetByType,
  calcOffersPrice,
};
