import { remove, render, RenderPosition } from '../framework/render';
import EventsListView from '../view/events-list-view';
import SortingView from '../view/sorting-view';
import NoEventsView from '../view/no-events-view';
import FailedLoadView from '../view/failed-load-view';
import LoadingView from '../view/loading-view';
import WaypointPresenter from './waypoint-presenter';
import { sortByDay, sortByPrice, sortByTime } from '../utils/waypoint';
import { FilterType, SortType, UpdateType, UserAction } from '../const';
import { filter } from '../utils/filter';
import NewWaypointPresenter from './new-waypoint-presenter';

export default class TripPresenter {
  #newWaypointPresenter = null;
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
  #isLoading = true;

  constructor({ containerEl, waypointsModel, destinationsModel, offersModel, filterModel, onNewEventDestroy }) {
    this.#containerEl = containerEl;
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newWaypointPresenter = new NewWaypointPresenter({
      waypointsContainerEl: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewEventDestroy,
    });
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

  createNewWaypoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);
    /* TODO: Не получилось передать `destinations` и `offers` в конструктор,
     *  т.к. на момент вызова конструктора это пустые массивы. Поэтому передаю их через метод `init()`
     */
    this.#newWaypointPresenter.init({
      destinations: this.#destinations,
      offers: this.#offers,
    });
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
    this.#newWaypointPresenter.destroy();

    remove(this.#sortingComponent);
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
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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

  #renderLoading() {
    render(this.#loadingComponent, this.#containerEl, RenderPosition.BEFOREEND);
  }

  #handleModeChange = () => {
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
    this.#newWaypointPresenter.destroy();
  };

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointPresenters.get(update.id).setSaving();
        try {
          await this.#waypointsModel.updateWaypoint(updateType, update);
        } catch (e) {
          this.#waypointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_WAYPOINT:
        this.#newWaypointPresenter.setSaving();
        try {
          await this.#waypointsModel.addWaypoint(updateType, update);
        } catch (e) {
          this.#newWaypointPresenter.setAborting();
        }
        break;
      case UserAction.REMOVE_WAYPOINT:
        this.#waypointPresenters.get(update.id).setDeleting();
        try {
          await this.#waypointsModel.removeWaypoint(updateType, update);
        } catch (e) {
          this.#waypointPresenters.get(update.id).setAborting();
        }
        break;
      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  };

  #handleModelEvent = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointPresenters.get(update.id).init(update);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({ resetSortType: true });
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.init();
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
