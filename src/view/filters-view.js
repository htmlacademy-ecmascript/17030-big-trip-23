import AbstractView from '../framework/view/abstract-view';
import { capitaliseFirstLetter } from '../utils/common';

const createFilterItemTemplate = (filter, activeFilter) => {
  const { type, hasItems } = filter;
  const checkedAttr = activeFilter === filter ? 'checked' : '';
  const disabledAttr = !hasItems ? 'disabled' : '';

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${checkedAttr} ${disabledAttr}>
      <label class="trip-filters__filter-label" for="filter-everything">${capitaliseFirstLetter(type)}</label>
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

  constructor({ filters, activeFilter }) {
    super();
    this.#filters = filters;
    this.#activeFilter = activeFilter;
  }

  get template() {
    return createFiltersTemplate({
      filters: this.#filters,
      activeFilter: this.#activeFilter,
    });
  }
}
