import { render } from '../framework/render';
import EventsListView from '../view/events-list-view';
import SortingView from '../view/sorting-view';
import EmptyEventsView from '../view/empty-events-view';
import FailedLoadView from '../view/failed-load-view';
import LoadingView from '../view/loading-view';
import WaypointPresenter from './waypoint-presenter';

export default class EventPresenter {
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

    if (!this.#waypoints.length) {
      this.#renderEmptyEventComponent();
      return;
    }

    this.#renderWaypointsList();
  }

  #renderWaypointsList() {
    for (let i = 0; i < this.#waypoints.length; i++) {
      this.#renderWaypointPresenter(this.#waypoints[i]);
    }
  }

  #renderEmptyEventComponent() {
    const emptyEventsComponent = new EmptyEventsView({ activeFilter: this.#activeFilter });
    render(emptyEventsComponent, this.#containerEl);
  }

  #renderWaypointPresenter(waypoint) {
    new WaypointPresenter({
      waypointsContainerEl: this.#eventsListComponent.element,
      destinations: this.#destinations,
      offers: this.#offers,
      waypoint,
    }).init();
  }
}
