import AbstractView from '../framework/view/abstract-view';
import { capitaliseFirstLetter } from '../utils/common';
import { SortType } from '../const';

const createSortingItemTemplate = (item, currentSortType) => {
  const checkedAttr = item === currentSortType ? 'checked' : '';

  return (`
    <div class="trip-sort__item  trip-sort__item--${item}">
      <input id="sort-${item}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${item}" ${checkedAttr}>
      <label class="trip-sort__btn" for="sort-${item}">${capitaliseFirstLetter(item)}</label>
    </div>`
  );
};

const createSortingTemplate = (currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${Object.values(SortType).map((type) => createSortingItemTemplate(type, currentSortType)).join('')}
    </form>`
);

export default class SortingView extends AbstractView {
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('change', this.#changeSortingHandler);
  }

  get template() {
    return createSortingTemplate(this.#currentSortType);
  }

  #changeSortingHandler = (evt) => {
    const [, selectedSortType] = evt.target.value.split('-');
    this.#handleSortTypeChange(selectedSortType);
  };
}
