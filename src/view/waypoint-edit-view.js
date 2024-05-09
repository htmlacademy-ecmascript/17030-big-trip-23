import AbstractView from '../framework/view/abstract-view';
import { WaypointEventType } from '../const';
import { capitaliseFirstLetter, humanizeDate } from '../utils';

const BLANK_WAYPOINT = {
  type: WaypointEventType.FLIGHT,
  dateFrom: null,
  dateTo: null,
  basePrice: 0,
  isFavorite: false,
  offers: [],
  destination: null,
};

const createWaypointTypeTemplate = (eventType) => {
  const label = capitaliseFirstLetter(eventType);

  return (
    `<div class="event__type-item">
      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}">
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${label}</label>
    </div>`
  );
};

const createWaypointTypeSelectTemplate = (type) => (
  `<div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>

        ${Object.values(WaypointEventType).map(createWaypointTypeTemplate).join('')}
      </fieldset>
    </div>
  </div>`
);

const createDestinationOptionTemplate = (name) => (
  `<option value="${name}"></option>`
);

const createDestinationSelectTemplate = (type, destination, destinations) => {
  const { id = '', name = '' } = destination;

  return (
    `<div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${capitaliseFirstLetter(type)}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${name}" list="destination-list-${id}">
      <datalist id="destination-list-${id}">
        ${destinations.map((it) => createDestinationOptionTemplate(it.name)).join('')}
      </datalist>
    </div>`
  );
};

const createWaypointOfferTemplate = (offer, isChecked) => {
  const { id, key, title, price } = offer;

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${key}-${id}" type="checkbox" name="event-offer-${key}" ${isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${key}-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createWaypointOffersTemplate = (availableOffers, selectedOfferIds) => (
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${availableOffers.map((offer) => {
    const isOfferChecked = selectedOfferIds.includes(offer.id);
    return createWaypointOfferTemplate(offer, isOfferChecked);
  }).join('')}
    </div>
  </section>`
);

const createDestinationPhotoTemplate = (picture) => {
  const { src, description } = picture;

  return (
    `<img class="event__photo" src="${src}" alt="${description}">`
  );
};

const createDestinationPhotosTemplate = (picture) => (
  `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${picture.map(createDestinationPhotoTemplate)}
    </div>
  </div>`
);

const createDestinationDescriptionTemplate = (destination) => {
  const { description, pictures } = destination;

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      ${pictures?.length ? createDestinationPhotosTemplate(pictures) : ''}
    </section>`
  );
};

const createWaypointEditTemplate = ({ waypoint, destinations, offers }) => {
  const {
    type,
    dateFrom,
    dateTo,
    basePrice,
    offers: offerIds,
    destination,
  } = waypoint;

  const pointTypeOffers = offers.find((offer) => offer.type === type).offers;
  const pointDestination = destinations.find(({ id }) => id === destination) || {};

  return (
    `<li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            ${createWaypointTypeSelectTemplate(type)}

            ${createDestinationSelectTemplate(type, pointDestination, destinations)}

            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom)}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo)}">
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Delete</button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </header>
          <section class="event__details">
            ${pointTypeOffers.length ? createWaypointOffersTemplate(pointTypeOffers, offerIds) : ''}

            ${destination ? createDestinationDescriptionTemplate(pointDestination) : ''}
          </section>
        </form>
      </li>`
  );
};

export default class WaypointEditView extends AbstractView {
  #waypoint = null;
  #destinations = [];
  #offers = [];
  #handleBtnFoldClick = null;

  constructor({ waypoint = BLANK_WAYPOINT, destinations, offers, onBtnFoldClick }) {
    super();
    this.#waypoint = waypoint;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleBtnFoldClick = onBtnFoldClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#btnFoldClickHandler);
  }

  get template() {
    return createWaypointEditTemplate({
      waypoint: this.#waypoint,
      destinations: this.#destinations,
      offers: this.#offers,
    });
  }

  #btnFoldClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleBtnFoldClick();
  };
}
