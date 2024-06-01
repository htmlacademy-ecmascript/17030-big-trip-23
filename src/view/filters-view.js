import AbstractView from '../framework/view/abstract-view';
import { capitaliseFirstLetter } from '../utils/common';

const createFilterItemTemplate = (filter, activeFilter) => {
  const { type, hasItems } = filter;
  const checkedAttr = activeFilter === type ? 'checked' : '';
  const disabledAttr = !hasItems ? 'disabled' : '';
  const matchingString = `filter-${type}`;

  return (
    `<div class="trip-filters__filter">
      <input id="${matchingString}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${checkedAttr} ${disabledAttr}>
      <label class="trip-filters__filter-label" for="${matchingString}">${capitaliseFirstLetter(type)}</label>
    </div>`
  );
};

const createFiltersTemplate = ({ filters, activeFilter }) => (
  `<form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => createFilterItemTemplate(filter, activeFilter)).join('')}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FiltersView extends AbstractView {
  #filters = [];
  #activeFilter = null;
  #handleFilterTypeChange = null;

  constructor({ filters, activeFilter, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#activeFilter = activeFilter;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFiltersTemplate({
      filters: this.#filters,
      activeFilter: this.#activeFilter,
    });
  }

  #filterTypeChangeHandler = (evt) => {
    // evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
