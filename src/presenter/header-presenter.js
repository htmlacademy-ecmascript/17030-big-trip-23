import HeaderView from '../view/header-view';
import { render, RenderPosition } from '../framework/render';
import NewEventButtonView from '../view/new-event-button-view';
import FilterPresenter from './filter-presenter';

export default class HeaderPresenter {
  #filterPresenter = null;
  #headerComponent = null;
  #newEventButtonComponent = null;
  #filterModel = null;
  #waypointsModel = null;
  #containerElement = null;

  constructor({ containerEl, filterModel, waypointsModel }) {
    this.#headerComponent = new HeaderView();
    this.#filterModel = filterModel;
    this.#waypointsModel = waypointsModel;
    this.#containerElement = containerEl;
    this.#newEventButtonComponent = new NewEventButtonView({
      onNewEventClick: () => {
        throw new Error('TODO: Написать код для клика по кнопке "New event"');
      },
    });
  }

  init() {
    render(this.#headerComponent, this.#containerElement, RenderPosition.AFTERBEGIN);

    const tripMainEl = this.#headerComponent.element.querySelector('.trip-main');
    const filterContainerEl = tripMainEl.querySelector('.trip-controls__filters');

    render(this.#newEventButtonComponent, tripMainEl);

    this.#filterPresenter = new FilterPresenter({
      filterContainerEl,
      filterModel: this.#filterModel,
      waypointsModel: this.#waypointsModel,
    });
    this.#filterPresenter.init();
  }
}
