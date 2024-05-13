import AbstractView from '../framework/view/abstract-view';

const createHeaderViewTemplate = () => (
  `<header class="page-header">
    <div class="page-body__container  page-header__container">
      <img class="page-header__logo" src="img/logo.png" width="42" height="42" alt="Trip logo">

      <div class="trip-main">
        <div class="trip-main__trip-controls  trip-controls">
          <div class="trip-controls__filters">
            <h2 class="visually-hidden">Filter events</h2>
          </div>
        </div>
      </div>
    </div>
  </header>`
);

export default class HeaderView extends AbstractView {
  get template() {
    return createHeaderViewTemplate();
  }
}
