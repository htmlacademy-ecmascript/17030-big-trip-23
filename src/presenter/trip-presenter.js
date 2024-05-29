import { remove, render } from '../framework/render';
import EventsListView from '../view/events-list-view';
import SortingView from '../view/sorting-view';
import NoEventsView from '../view/no-events-view';
import FailedLoadView from '../view/failed-load-view';
import LoadingView from '../view/loading-view';
import WaypointPresenter from './waypoint-presenter';
import { sortByDay, sortByPrice, sortByTime } from '../utils/waypoint';
import { SortType, UpdateType, UserAction } from '../const';
import { filter } from '../utils/filter';

export default class TripPresenter {
  #waypointPresenters = new Map();

  #containerEl = null;
  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #sortingComponent = null;
  #noEventsComponent = null;
  #eventsListComponent = new EventsListView();
  #failedLoadComponent = new FailedLoadView();
  #loadingComponent = new LoadingView();

  #destinations = [];
  #offers = [];
  #currentSortType = SortType.DAY;

  constructor({ containerEl, waypointsModel, destinationsModel, offersModel, filterModel }) {
    this.#containerEl = containerEl;
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get #activeFilter() {
    return this.#filterModel.filter;
  }

  get waypoints() {
    const waypoints = this.#waypointsModel.waypoints;
    const filteredWaypoints = filter[this.#activeFilter](waypoints);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...filteredWaypoints].sort(sortByDay);

      case SortType.TIME:
        return [...filteredWaypoints].sort(sortByTime);

      case SortType.PRICE:
        return [...filteredWaypoints].sort(sortByPrice);

      // TODO: Сортировка по этим типам не требуется
      case SortType.EVENT:
      case SortType.OFFER:
      default:
        return filteredWaypoints;
    }
  }

  init() {
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#renderTrip();
  }

  #renderSortingComponent() {
    this.#sortingComponent = new SortingView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortingComponent, this.#containerEl);
  }

  #renderNoEventsComponent() {
    this.#noEventsComponent = new NoEventsView({ activeFilter: this.#activeFilter });
    render(this.#noEventsComponent, this.#containerEl);
  }

  #clearTrip({ resetSortType = false } = {}) {
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();

    remove(this.#sortingComponent);
    remove(this.#eventsListComponent);
    remove(this.#failedLoadComponent);
    remove(this.#loadingComponent);

    if (this.#noEventsComponent) {
      remove(this.#noEventsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderTrip() {
    this.#renderSortingComponent();
    render(this.#eventsListComponent, this.#containerEl);

    if (!this.waypoints.length) {
      this.#renderNoEventsComponent();
      return;
    }

    for (let i = 0; i < this.waypoints.length; i++) {
      this.#renderWaypointPresenter(this.waypoints[i]);
    }
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
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointsModel.updateWaypoint(updateType, update);
        break;
      case UserAction.ADD_WAYPOINT:
        this.#waypointsModel.addWaypoint(updateType, update);
        break;
      case UserAction.REMOVE_WAYPOINT:
        this.#waypointsModel.removeWaypoint(updateType, update);
        break;
      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  };

  #handleModelEvent = (updateType, update) => {
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#waypointPresenters.get(update.id).init(update);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        // - обновить список
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({ resetSortType: true });
        this.#renderTrip();
        // - обновить всю поездку (например, при переключении фильтра)
        break;
      default:
        throw new Error(`Unknown update type: ${updateType}`);
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };
}
