import { calcOffersPrice, getOffersSetByType } from '../utils/offers';
import AbstractView from '../framework/view/abstract-view';
import { getDestinationById, printCitiesRoutes } from '../utils/destination';
import { printTripDuration } from '../utils/waypoint';

const printCities = ({ waypoints, destinations }) => {
  const usedDestinations = waypoints.map(({ destination }) => getDestinationById(destinations, destination));

  return printCitiesRoutes(usedDestinations);
};

const printDuration = (firstWaypoint, lastWaypoint) => {
  const startDate = firstWaypoint?.dateFrom;
  const endDate = lastWaypoint?.dateTo;

  return printTripDuration(startDate, endDate);
};

const calcTotalPrice = ({ waypoints, offers }) => waypoints.reduce((total, waypoint) => {
  const waypointPrice = waypoint.basePrice;
  const typedOffers = getOffersSetByType(offers, waypoint.type).offers;
  const filteredTypedOffers = typedOffers.filter(({id}) => waypoint.offers.includes(id));
  const offersPrice = calcOffersPrice(filteredTypedOffers);

  return total + waypointPrice + offersPrice;
}, 0);

const createTripInfoTemplate = ({ waypoints, destinations, offers }) => {
  const cities = printCities({ waypoints, destinations });
  const dates = printDuration(waypoints.at(0), waypoints.at(-1));
  const totalPrice = calcTotalPrice({ waypoints, offers });

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${cities}</h1>

        <p class="trip-info__dates">${dates}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`
  );
};

export default class TripInfoView extends AbstractView {
  #waypoints = [];
  #destinations = [];
  #offers = [];

  constructor({ waypoints, destinations, offers }) {
    super();
    this.#waypoints = waypoints;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoTemplate({
      waypoints: this.#waypoints,
      destinations: this.#destinations,
      offers: this.#offers,
    });
  }
}
