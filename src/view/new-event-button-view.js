import AbstractView from '../framework/view/abstract-view';

const createNewEventButtonTemplate = () => (
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>'
);

export default class NewEventButtonView extends AbstractView {
  #handleNewEventClick = null;

  constructor({ onNewEventClick }) {
    super();
    this.#handleNewEventClick = onNewEventClick;
    this.element.addEventListener('click', this.#newEventClickHandler);
  }

  get template() {
    return createNewEventButtonTemplate();
  }

  #newEventClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleNewEventClick();
  };
}
