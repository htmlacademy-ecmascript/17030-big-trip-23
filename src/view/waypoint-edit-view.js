import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { WaypointEventType } from '../const';
import { humanizeDate } from '../utils/waypoint';
import { capitaliseFirstLetter } from '../utils/common';
import { getDestinationIdByName } from '../mock/destinations';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_WAYPOINT = {
  type: WaypointEventType.FLIGHT,
  dateFrom: null,
  dateTo: null,
  basePrice: 0,
  isFavorite: false,
  offers: [],
  destination: null,
};

const createWaypointTypeTemplate = ({ eventType, pickedType, waypointId }) => {
  const matchingString = `event-type-${eventType}-${waypointId}`;
  const label = capitaliseFirstLetter(eventType);
  const isCheckedAttrActive = eventType === pickedType ? 'checked' : '';

  return (
    `<div class="event__type-item">
      <input id="${matchingString}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${isCheckedAttrActive}>
      <label class="event__type-label  event__type-label--${eventType}" for="${matchingString}">${label}</label>
    </div>`
  );
};

const createWaypointTypeSelectTemplate = (pickedType, waypointId) => {
  const matchingString = `event-type-toggle-${waypointId}`;
  const waypointTypesTemplate = Object.values(WaypointEventType).map((eventType) => createWaypointTypeTemplate({
    eventType,
    pickedType,
    waypointId,
  })).join('');

  return (
    `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="${matchingString}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${pickedType}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="${matchingString}" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${waypointTypesTemplate}
        </fieldset>
      </div>
    </div>`
  );
};

const createDestinationOptionTemplate = (name) => (
  `<option value="${name}"></option>`
);

const createDestinationSelectTemplate = ({ type, destination, destinations, waypointId }) => {
  const { name = '' } = destination;
  const matchingString = `event-destination-${waypointId}`;
  const listMatchingString = `destination-list-${waypointId}`;

  return (
    `<div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="${matchingString}">
        ${capitaliseFirstLetter(type)}
      </label>
      <input class="event__input  event__input--destination" id="${matchingString}" type="text" name="event-destination" value="${name}" list="${listMatchingString}">
      <datalist id="${listMatchingString}">
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
      ${picture.map(createDestinationPhotoTemplate).join('')}
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
    id,
    type,
    dateFrom,
    dateTo,
    basePrice,
    offers: offerIds,
    destination,
  } = waypoint;

  const pointTypeOffers = offers.find((offer) => offer.type === type)?.offers || [];
  const pointDestination = destinations.find(({ id: destinationId }) => destinationId === destination) || {};

  return (
    `<li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            ${createWaypointTypeSelectTemplate(type, id)}

            ${createDestinationSelectTemplate({ type, destination: pointDestination, destinations, waypointId: id })}

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

export default class WaypointEditView extends AbstractStatefulView {
  #destinations = [];
  #offers = [];
  #handleBtnFoldClick = null;
  #handleSubmit = null;
  #handleReset = null;

  constructor({ waypoint = BLANK_WAYPOINT, destinations, offers, onBtnFoldClick, onSubmit, onReset }) {
    super();
    this._setState(WaypointEditView.parseWaypointToState(waypoint));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleBtnFoldClick = onBtnFoldClick;
    this.#handleSubmit = onSubmit;
    this.#handleReset = onReset;

    this._restoreHandlers();
  }

  get template() {
    return createWaypointEditTemplate({
      waypoint: this._state,
      destinations: this.#destinations,
      offers: this.#offers,
    });
  }

  reset(waypoint) {
    this.updateElement(WaypointEditView.parseWaypointToState(waypoint));
  }

  _restoreHandlers() {
    const formEl = this.element.querySelector('.event--edit');

    formEl.addEventListener('submit', this.#formSubmitHandler);
    formEl.addEventListener('reset', this.#formResetHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#btnFoldClickHandler);
  }

  #btnFoldClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleBtnFoldClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit(WaypointEditView.parseStateToWaypoint(this._state));
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();
    this.#handleReset();
  };

  #typeChangeHandler = (evt) => {
    const type = evt.target.value;
    this.updateElement({ type });
  };

  #destinationChangeHandler = (evt) => {
    const destinationName = evt.target.value;
    const destination = getDestinationIdByName(destinationName);
    this.updateElement({ destination });
  };

  static parseWaypointToState(waypoint) {
    return { ...waypoint };
  }

  static parseStateToWaypoint(state) {
    return { ...state };
  }
}
