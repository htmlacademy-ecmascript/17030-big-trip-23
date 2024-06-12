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
import UiBlocker from '../framework/ui-blocker/ui-blocker';

const TimeLimit = {
  LOWER_LIMIT: 300,
  UPPER_LIMIT: 1000,
};

export default class TripPresenter {
  #newWaypointPresenter = null;
  #waypointPresenters = new Map();

  #handleNewEventDestroy = null;
  #containerEl = null;
  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #sortingComponent = null;
  #noEventsComponent = null;
  #failedLoadComponent = null;
  #loadingComponent = new LoadingView();
  #eventsListComponent = new EventsListView();

  #destinations = [];
  #offers = [];
  #currentSortType = SortType.DAY;
  #isLoading = true;
  #isLoadingFailed = false;
  #isCreatingNewWaypoint = false;
  uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  constructor({ containerEl, waypointsModel, destinationsModel, offersModel, filterModel, onNewEventDestroy }) {
    this.#containerEl = containerEl;
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#handleNewEventDestroy = onNewEventDestroy;

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

  createNewWaypoint() {
    this.#isCreatingNewWaypoint = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);
    this.#newWaypointPresenter.init();
  }

  handleApiError() {
    this.#isLoadingFailed = true;

    this.#clearTrip();
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

  #renderFailedLoadComponent() {
    this.#failedLoadComponent = new FailedLoadView();
    render(this.#failedLoadComponent, this.#containerEl);
  }

  #clearTrip({ resetSortType = false } = {}) {
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();
    this.#newWaypointPresenter?.destroy();

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
    if (this.#isLoadingFailed) {
      this.#renderFailedLoadComponent();
      this.#isLoadingFailed = false;
      return;
    }

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderSortingComponent();
    render(this.#eventsListComponent, this.#containerEl);
    this.#renderNewWaypointPresenter();

    if (!this.waypoints.length) {
      if (this.#isCreatingNewWaypoint) {
        return;
      }

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

  #renderNewWaypointPresenter() {
    this.#newWaypointPresenter = new NewWaypointPresenter({
      waypointsContainerEl: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      destinations: this.#destinations,
      offers: this.#offers,
      onDestroy: this.#newEventDestroyHandler,
    });
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#containerEl, RenderPosition.BEFOREEND);
  }

  #handleModeChange = () => {
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
    this.#newWaypointPresenter.destroy();
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.uiBlocker.block();

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

    this.uiBlocker.unblock();
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

  #newEventDestroyHandler = () => {
    this.#isCreatingNewWaypoint = false;

    if (!this.waypoints.length) {
      this.#renderNoEventsComponent();
    }

    this.#handleNewEventDestroy();
  };
}
