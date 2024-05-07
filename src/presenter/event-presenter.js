import { render } from '../framework/render';
import EventsListView from '../view/events-list-view';
import WaypointEditView from '../view/waypoint-edit-view';
import WaypointView from '../view/waypoint-view';
import SortingView from '../view/sorting-view';

export default class EventPresenter {
  #containerEl = null;
  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #sortingComponent = new SortingView();
  #eventsListComponent = new EventsListView();
  #waypointEditComponent = null;
  #waypointComponent = null;

  #waypoints = [];
  #destinations = [];
  #offers = [];

  constructor({ containerEl, waypointsModel, destinationsModel, offersModel }) {
    this.#containerEl = containerEl;
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  #renderWaypointEditComponent({ waypoint, destinations, offers }) {
    this.#waypointEditComponent = new WaypointEditView({
      waypoint,
      destinations,
      offers,
    });
    render(this.#waypointEditComponent, this.#eventsListComponent.element);
  }

  #renderWaypointComponent({ waypoint, destinations, offers }) {
    this.#waypointComponent = new WaypointView({
      waypoint,
      destinations,
      offers,
    });
    render(this.#waypointComponent, this.#eventsListComponent.element);
  }

  init() {
    this.#waypoints = [...this.#waypointsModel.waypoints];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    render(this.#sortingComponent, this.#containerEl);
    render(this.#eventsListComponent, this.#containerEl);

    this.#renderWaypointEditComponent({
      waypoint: this.#waypoints[0],
      destinations: this.#destinations,
      offers: this.#offers,
    });

    for (let i = 1; i < this.#waypoints.length; i++) {
      this.#renderWaypointComponent({
        waypoint: this.#waypoints[i],
        destinations: this.#destinations,
        offers: this.#offers,
      });
    }
  }
}
