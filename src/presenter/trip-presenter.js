import { render } from '../framework/render';
import EventsListView from '../view/events-list-view';
import SortingView from '../view/sorting-view';
import NoEventsView from '../view/no-events-view';
import FailedLoadView from '../view/failed-load-view';
import LoadingView from '../view/loading-view';
import WaypointPresenter from './waypoint-presenter';
import { sortByPrice, sortByTime } from '../utils/waypoint';
import { SortType } from '../const';

export default class TripPresenter {
  #waypointPresenters = new Map();

  #containerEl = null;
  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #activeFilter = null;

  #sortingComponent = null;
  #eventsListComponent = new EventsListView();
  #failedLoadComponent = new FailedLoadView();
  #loadingComponent = new LoadingView();

  #destinations = [];
  #offers = [];
  #currentSortType = SortType.DAY;

  constructor({ containerEl, waypointsModel, destinationsModel, offersModel, activeFilter }) {
    this.#containerEl = containerEl;
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#activeFilter = activeFilter;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
  }

  get waypoints() {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return this.#waypointsModel.waypoints;

      case SortType.TIME:
        return [...this.#waypointsModel.waypoints].sort(sortByTime);

      case SortType.PRICE:
        return [...this.#waypointsModel.waypoints].sort(sortByPrice);

      // TODO: Сортировка по этим типам не требуется
      case SortType.EVENT:
      case SortType.OFFER:
      default:
        return this.#waypointsModel.waypoints;
    }
  }

  init() {
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#renderSortingComponent();
    render(this.#eventsListComponent, this.#containerEl);

    this.#renderWaypoints();
  }

  #renderSortingComponent() {
    this.#sortingComponent = new SortingView({
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortingComponent, this.#containerEl);
  }

  #renderWaypoints() {
    if (!this.waypoints.length) {
      this.#renderNoEventsComponent();
      return;
    }

    this.#renderWaypointsList();
  }

  #clearWaypointsList() {
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();
  }

  #renderWaypointsList() {
    for (let i = 0; i < this.waypoints.length; i++) {
      this.#renderWaypointPresenter(this.waypoints[i]);
    }
  }

  #renderNoEventsComponent() {
    const noEventsComponent = new NoEventsView({ activeFilter: this.#activeFilter });
    render(noEventsComponent, this.#containerEl);
  }

  #renderWaypointPresenter(waypoint) {
    const waypointPresenter = new WaypointPresenter({
      waypointsContainerEl: this.#eventsListComponent.element,
      destinations: this.#destinations,
      offers: this.#offers,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    waypointPresenter.init(waypoint);
    this.#waypointPresenters.set(waypoint.id, waypointPresenter);
  }

  #handleModeChange = () => {
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  };

  #handleModelEvent = (updateType, update) => {
    console.log(updateType, update);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearWaypointsList();
    this.#renderWaypointsList();
  };
}
