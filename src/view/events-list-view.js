import AbstractView from '../framework/view/abstract-view';

function createEventListView() {
  return (
    '<ul class="trip-events__list"></ul>'
  );
}

export default class EventsListView extends AbstractView {
  get template() {
    return createEventListView();
  }
}
