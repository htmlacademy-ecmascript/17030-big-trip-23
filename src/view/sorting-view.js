import AbstractView from '../framework/view/abstract-view';
import { capitaliseFirstLetter } from '../utils/common';
import { SortType } from '../const';

const createSortingItemTemplate = (item) => (`
  <div class="trip-sort__item  trip-sort__item--${item}">
    <input id="sort-${item}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${item}">
    <label class="trip-sort__btn" for="sort-${item}">${capitaliseFirstLetter(item)}</label>
  </div>`
);

const createSortingTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${Object.values(SortType).map(createSortingItemTemplate).join('')}
    </form>`
);

export default class SortingView extends AbstractView {
  #handleSortTypeChange = null;

  constructor({ onSortTypeChange }) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('change', this.#changeSortingHandler);
  }

  get template() {
    return createSortingTemplate();
  }

  #changeSortingHandler = (evt) => {
    const [, selectedSortType] = evt.target.value.split('-');
    this.#handleSortTypeChange(selectedSortType);
  };
}
