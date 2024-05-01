import { createElement } from '../render';
import { getDateStringFromDate, getTimeStringFromDate, humanizeDay } from '../utils';

const createOfferTemplate = (offer) => {
  const { title, price } = offer;

  return (`<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`);
};

const createWaypointView = ({ waypoint, destinations, offers }) => {
  const {
    type,
    timeStart,
    timeEnd,
    price,
    isFavorite,
    offerIds,
    destinationId,
  } = waypoint;

  const typeImageName = `${type.toLowerCase()}.png`;
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';
  const destination = destinations.find(({ id }) => id === destinationId) || {};
  const pointTypeOffers = offers.find((offer) => offer.type === type).offers;
  const selectedOffers = pointTypeOffers.filter(({ id }) => offerIds.includes(id));

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${getDateStringFromDate(timeStart)}">${humanizeDay(timeStart)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${typeImageName}" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${timeStart.toISOString()}">${getTimeStringFromDate(timeStart)}</time>
            &mdash;
            <time class="event__end-time" datetime="${timeEnd.toISOString()}">${getTimeStringFromDate(timeEnd)}</time>
          </p>
          <p class="event__duration">30M</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${selectedOffers.map(createOfferTemplate).join('')}
        </ul>
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li> `
  );
};

export default class WaypointView {
  constructor({ waypoint, destinations, offers }) {
    this.waypoint = waypoint;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate() {
    return createWaypointView({
      waypoint: this.waypoint,
      destinations: this.destinations,
      offers: this.offers,
    });
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
