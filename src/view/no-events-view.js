import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../const';

const NoEventsMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const createNoEventsTemplate = (activeFilter) => (
  `<p class="trip-events__msg">${NoEventsMessage[activeFilter]}</p>`
);

export default class NoEventsView extends AbstractView {
  #activeFilter = null;

  constructor({ activeFilter }) {
    super();
    this.#activeFilter = activeFilter;
  }

  get template() {
    return createNoEventsTemplate(this.#activeFilter);
  }
}
