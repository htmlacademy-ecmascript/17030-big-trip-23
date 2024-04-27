import {createElement} from '../render';

function createEventListView() {
  return (
    '<ul class="trip-events__list"></ul>'
  );
}

export default class EventsListView {
  getTemplate() {
    return createEventListView();
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
