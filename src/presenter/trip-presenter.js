import { render } from '../framework/render';
import EventsListView from '../view/events-list-view';
import SortingView from '../view/sorting-view';
import NoEventsView from '../view/no-events-view';
import FailedLoadView from '../view/failed-load-view';
import LoadingView from '../view/loading-view';
import WaypointPresenter from './waypoint-presenter';
import { sortByPrice, sortByTime, updateWaypoint } from '../utils/waypoint';
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

  #waypoints = [];
  #sourcedWaypoints = [];
  #destinations = [];
  #offers = [];
  #currentSortType = SortType.DAY;

  constructor({ containerEl, waypointsModel, destinationsModel, offersModel, activeFilter }) {
    this.#containerEl = containerEl;
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#activeFilter = activeFilter;
  }

  init() {
    this.#waypoints = [...this.#waypointsModel.waypoints];
    this.#sourcedWaypoints = [...this.#waypointsModel.waypoints];
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
    if (!this.#waypoints.length) {
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
    for (let i = 0; i < this.#waypoints.length; i++) {
      this.#renderWaypointPresenter(this.#waypoints[i]);
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
      onDataChange: this.#handleWaypointChange,
      onModeChange: this.#handleModeChange,
    });

    waypointPresenter.init(waypoint);
    this.#waypointPresenters.set(waypoint.id, waypointPresenter);
  }

  #sortWaypoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#waypoints = [...this.#sourcedWaypoints];
        break;
      case SortType.TIME:
        this.#waypoints.sort(sortByTime);
        break;

      case SortType.PRICE:
        this.#waypoints.sort(sortByPrice);
        break;

      case SortType.EVENT:
      case SortType.OFFER:
        return;
    }

    this.#currentSortType = sortType;
  }

  #handleModeChange = () => {
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleWaypointChange = (updatedWaypoint) => {
    this.#waypoints = updateWaypoint(this.#waypoints, updatedWaypoint);
    this.#sourcedWaypoints = updateWaypoint(this.#sourcedWaypoints, updatedWaypoint);
    this.#waypointPresenters.get(updatedWaypoint.id).init(updatedWaypoint);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortWaypoints(sortType);
    this.#clearWaypointsList();
    this.#renderWaypointsList();
  };
}
