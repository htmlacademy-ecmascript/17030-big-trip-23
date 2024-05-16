import { render } from '../framework/render';
import EventsListView from '../view/events-list-view';
import SortingView from '../view/sorting-view';
import NoEventsView from '../view/no-events-view';
import FailedLoadView from '../view/failed-load-view';
import LoadingView from '../view/loading-view';
import WaypointPresenter from './waypoint-presenter';
import { updateWaypoint } from '../utils/waypoint';

export default class EventPresenter {
  #waypointPresenters = new Map();

  #containerEl = null;
  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #activeFilter = null;

  #sortingComponent = new SortingView();
  #eventsListComponent = new EventsListView();
  #failedLoadComponent = new FailedLoadView();
  #loadingComponent = new LoadingView();

  #waypoints = [];
  #destinations = [];
  #offers = [];

  constructor({ containerEl, waypointsModel, destinationsModel, offersModel, activeFilter }) {
    this.#containerEl = containerEl;
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#activeFilter = activeFilter;
  }

  init() {
    this.#waypoints = [...this.#waypointsModel.waypoints];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    render(this.#sortingComponent, this.#containerEl);
    render(this.#eventsListComponent, this.#containerEl);

    this.#renderWaypoints();
  }

  #renderWaypoints() {
    if (!this.#waypoints.length) {
      this.#renderNoEventsComponent();
      return;
    }

    this.#renderWaypointsList();
  }

  #renderWaypointsList() {
    for (let i = 0; i < this.#waypoints.length; i++) {
      this.#renderWaypointPresenter(this.#waypoints[i]);
    }
  }

  #renderNoEventsComponent() {
    const emptyEventsComponent = new NoEventsView({ activeFilter: this.#activeFilter });
    render(emptyEventsComponent, this.#containerEl);
  }

  #renderWaypointPresenter(waypoint) {
    const waypointPresenter = new WaypointPresenter({
      waypointsContainerEl: this.#eventsListComponent.element,
      destinations: this.#destinations,
      offers: this.#offers,
      onDataChange: this.#handleWaypointChange,
    });

    waypointPresenter.init(waypoint);
    this.#waypointPresenters.set(waypoint.id, waypointPresenter);
  }

  #handleWaypointChange = (updatedWaypoint) => {
    updateWaypoint(this.#waypoints, updatedWaypoint);
    this.#waypointPresenters.get(updatedWaypoint.id).init(updatedWaypoint);
  };
}
