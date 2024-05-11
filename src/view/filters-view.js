import AbstractView from '../framework/view/abstract-view';
import { capitaliseFirstLetter } from '../utils/common';

const FILTERS = [
  'everything',
  'future',
  'present',
  'past',
];

const createFilterItemTemplate = (filter, activeFilter) => (
  `<div class="trip-filters__filter">
    <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${filter === activeFilter ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-everything">${capitaliseFirstLetter(filter)}</label>
  </div>`
);

const createFiltersTemplate = (activeFilter) => (
  `<form class="trip-filters" action="#" method="get">
      ${FILTERS.map((it) => createFilterItemTemplate(it, activeFilter)).join('')}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
);

export default class FiltersView extends AbstractView {
  #activeFilter = null;

  constructor({ activeFilter }) {
    super();
    this.#activeFilter = activeFilter;
  }

  get template() {
    return createFiltersTemplate(this.#activeFilter);
  }
}
