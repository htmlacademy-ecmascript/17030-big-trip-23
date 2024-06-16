import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { WaypointEventType } from '../const';
import { humanizeDate } from '../utils/waypoint';
import { capitaliseFirstLetter } from '../utils/common';
import { getDestinationIdByName } from '../utils/destination';
import flatpickr from 'flatpickr';
import he from 'he';

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

const createWaypointTypeSelectTemplate = ({ pickedType, waypointId, isDisabled }) => {
  const matchingString = `event-type-toggle-${waypointId}`;
  const disabledAttr = isDisabled ? 'disabled' : '';
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
      <input class="event__type-toggle  visually-hidden" id="${matchingString}" type="checkbox" ${disabledAttr}>

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

const createDestinationSelectTemplate = ({ pickedType, destination, destinations, waypointId, isDisabled }) => {
  const { name = '' } = destination;
  const matchingString = `event-destination-${waypointId}`;
  const listMatchingString = `destination-list-${waypointId}`;
  const disabledAttr = isDisabled ? 'disabled' : '';

  return (
    `<div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="${matchingString}">
        ${capitaliseFirstLetter(pickedType)}
      </label>
      <input class="event__input  event__input--destination" id="${matchingString}" type="text" name="event-destination" value="${he.encode(name)}" list="${listMatchingString}" ${disabledAttr}>
      <datalist id="${listMatchingString}">
        ${destinations.map((it) => createDestinationOptionTemplate(it.name)).join('')}
      </datalist>
    </div>`
  );
};

const createWaypointOfferTemplate = ({ offer, isChecked, isDisabled }) => {
  const { id, key, title, price } = offer;
  const disabledAttr = isDisabled ? 'disabled' : '';

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${key}-${id}" type="checkbox" value="${id}" name="event-offer-${key}" ${isChecked ? 'checked' : ''} ${disabledAttr}>
      <label class="event__offer-label" for="event-offer-${key}-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createWaypointOffersTemplate = ({ availableOffers, selectedOfferIds, isDisabled }) => (
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${availableOffers.map((offer) => {
    const isChecked = selectedOfferIds.includes(offer.id);
    return createWaypointOfferTemplate({ offer, isChecked, isDisabled });
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

const createDestinationPhotosTemplate = (pictures) => (
  `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${pictures.map(createDestinationPhotoTemplate).join('')}
    </div>
  </div>`
);

const createDestinationDescriptionTemplate = ({ description, pictures }) => (description || pictures?.length) ? (
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>

    ${pictures?.length ? createDestinationPhotosTemplate(pictures) : ''}
  </section>`
) : '';

const createOpenEventButtonTemplate = () => (
  `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`
);

const createWaypointEditTemplate = ({ data, destinations, offers }) => {
  const {
    id,
    type,
    dateFrom,
    dateTo,
    basePrice,
    offers: offerIds,
    destination,
    isDisabled,
    isSaving,
    isDeleting,
  } = data;

  const isNewWaypoint = !id;
  const pointTypeOffers = offers.find((offer) => offer.type === type)?.offers || [];
  const pointDestination = destinations.find(({ id: destinationId }) => destinationId === destination) || {};
  const eventStartTimeMatchingAttrValue = `event-start-time-${id}`;
  const eventEndTimeMatchingAttrValue = `event-end-time-${id}`;
  const eventPriceMatchingAttrValue = `event-price-${id}`;
  const saveButtonName = isSaving ? 'Saving...' : 'Save';
  const deleteButtonName = isDeleting ? 'Deleting...' : 'Delete';
  const resetButtonName = isNewWaypoint ? 'Cancel' : deleteButtonName;
  const disabledAttr = isDisabled ? 'disabled' : '';

  const waypointTypeSelectTemplate = createWaypointTypeSelectTemplate({
    pickedType: type,
    waypointId: id,
    isDisabled,
  });
  const destinationSelectTemplate = createDestinationSelectTemplate({
    pickedType: type,
    destination: pointDestination,
    destinations,
    waypointId: id,
    isDisabled,
  });
  const waypointOffersTemplate = pointTypeOffers.length
    ? createWaypointOffersTemplate({
      availableOffers: pointTypeOffers,
      selectedOfferIds: offerIds,
      isDisabled,
    })
    : '';
  const openEventButtonTemplate = !isNewWaypoint ? createOpenEventButtonTemplate() : '';
  const destinationDescriptionTemplate = destination ? createDestinationDescriptionTemplate(pointDestination) : '';

  return (
    `<li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            ${waypointTypeSelectTemplate}
            ${destinationSelectTemplate}
            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="${eventStartTimeMatchingAttrValue}">From</label>
              <input class="event__input  event__input--time" id="${eventStartTimeMatchingAttrValue}" type="text" name="event-start-time" value="${humanizeDate(dateFrom)}" ${disabledAttr}>
              &mdash;
              <label class="visually-hidden" for="${eventEndTimeMatchingAttrValue}">To</label>
              <input class="event__input  event__input--time" id="${eventEndTimeMatchingAttrValue}" type="text" name="event-end-time" value="${humanizeDate(dateTo)}" ${disabledAttr}>
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="${eventPriceMatchingAttrValue}">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="${eventPriceMatchingAttrValue}" type="text" name="event-price" value="${he.encode(basePrice.toString(10))}" ${disabledAttr}>
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit" ${disabledAttr}>${saveButtonName}</button>
            <button class="event__reset-btn" type="reset">${resetButtonName}</button>
            ${openEventButtonTemplate}
          </header>
          <section class="event__details">
            ${waypointOffersTemplate}
            ${destinationDescriptionTemplate}
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
  #handleRemove = null;
  #eventStartDatepicker = null;
  #eventEndDatepicker = null;
  #isNewWaypoint = null;

  constructor({ waypoint = BLANK_WAYPOINT, destinations, offers, onBtnFoldClick, onSubmit, onRemove }) {
    super();
    this._setState(WaypointEditView.parseWaypointToState(waypoint));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleBtnFoldClick = onBtnFoldClick;
    this.#handleSubmit = onSubmit;
    this.#handleRemove = onRemove;
    this.#isNewWaypoint = !waypoint.id;

    this._restoreHandlers();
  }

  get template() {
    return createWaypointEditTemplate({
      data: this._state,
      destinations: this.#destinations,
      offers: this.#offers,
    });
  }

  removeElement() {
    super.removeElement();

    if (this.#eventStartDatepicker) {
      this.#eventStartDatepicker.destroy();
      this.#eventStartDatepicker = null;
    }

    if (this.#eventEndDatepicker) {
      this.#eventEndDatepicker.destroy();
      this.#eventEndDatepicker = null;
    }
  }

  _restoreHandlers() {
    const editFormElement = this.element.querySelector('.event--edit');
    const destinationInputElement = this.element.querySelector('.event__input--destination');
    const priceInputElement = this.element.querySelector('.event__input--price');
    const rollupBtnElement = this.element.querySelector('.event__rollup-btn');

    editFormElement.addEventListener('submit', this.#formSubmitHandler);
    editFormElement.addEventListener('reset', this.#waypointRemoveHandler);
    editFormElement.addEventListener('change', this.#formChangeHandler);

    destinationInputElement.addEventListener('change', this.#destinationChangeHandler);

    priceInputElement.addEventListener('keydown', this.#priceKeydownHandler);
    priceInputElement.addEventListener('change', this.#priceChangeHandler);

    if (!this.#isNewWaypoint) {
      rollupBtnElement.addEventListener('click', this.#btnFoldClickHandler);
    }

    this.#setEventStartDatepicker();
    this.#setEventEndDatepicker();
  }

  reset(waypoint) {
    this.updateElement(WaypointEditView.parseWaypointToState(waypoint));
  }

  #btnFoldClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleBtnFoldClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit(WaypointEditView.parseStateToWaypoint(this._state));
  };

  #waypointRemoveHandler = (evt) => {
    evt.preventDefault();
    this.#handleRemove(WaypointEditView.parseStateToWaypoint(this._state));
  };

  #offerChangeHandler = (evt) => {
    const offerId = evt.target.value;
    const isChecked = evt.target.checked;
    let offers = [...this._state.offers];

    if (isChecked) {
      offers.push(offerId);
    } else {
      offers = offers.filter((id) => id !== offerId);
    }

    this.updateElement({ offers });
  };

  #typeChangeHandler = (evt) => {
    const type = evt.target.value;
    const offers = [];
    this.updateElement({ type, offers });
  };

  #formChangeHandler = (evt) => {
    const input = evt.target;

    if (input.matches('.event__offer-checkbox')) {
      this.#offerChangeHandler(evt);
    } else if (input.matches('.event__type-input')) {
      this.#typeChangeHandler(evt);
    }
  };

  #priceKeydownHandler = (evt) => {
    const isKeyDigit = /\d/.test(evt.key);
    const isKeyBackspace = evt.key === 'Backspace';
    const isKeyDelete = evt.key === 'Delete';

    if (!(isKeyDigit || isKeyBackspace || isKeyDelete)) {
      evt.preventDefault();
    }
  };

  #priceChangeHandler = (evt) => {
    const value = evt.target.value || '0';
    const basePrice = parseInt(value, 10);
    this._setState({ basePrice });
  };

  #destinationChangeHandler = (evt) => {
    const destinationName = evt.target.value;
    const destination = getDestinationIdByName(this.#destinations, destinationName);
    this.updateElement({ destination });
  };

  #eventStartDatepickerCloseHandler = ([newDate]) => {
    this.updateElement({
      dateFrom: newDate,
    });
  };

  #eventEndDatepickerCloseHandler = ([newDate]) => {
    this.updateElement({
      dateTo: newDate,
    });
  };

  #setEventStartDatepicker() {
    this.#eventStartDatepicker = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onClose: this.#eventStartDatepickerCloseHandler,
      },
    );
  }

  #setEventEndDatepicker() {
    this.#eventStartDatepicker = flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onClose: this.#eventEndDatepickerCloseHandler,
      },
    );
  }

  static parseWaypointToState(waypoint) {
    return {
      ...waypoint,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToWaypoint(state) {
    const waypoint = { ...state };

    delete waypoint.isDisabled;
    delete waypoint.isSaving;
    delete waypoint.isDeleting;

    return waypoint;
  }
}
