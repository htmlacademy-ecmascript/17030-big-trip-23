import { render, replace } from '../framework/render';
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

  #waypoints = [];
  #destinations = [];
  #offers = [];

  constructor({ containerEl, waypointsModel, destinationsModel, offersModel }) {
    this.#containerEl = containerEl;
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#waypoints = [...this.#waypointsModel.waypoints];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    render(this.#sortingComponent, this.#containerEl);
    render(this.#eventsListComponent, this.#containerEl);

    for (let i = 0; i < this.#waypoints.length; i++) {
      this.#renderWaypoint(this.#waypoints[i]);
    }
  }

  #renderWaypoint(waypoint) {
    const escKeydownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditedWaypointToWaypoint();
        window.document.removeEventListener('keydown', escKeydownHandler);
      }
    };

    const waypointComponent = new WaypointView({
      waypoint: waypoint,
      destinations: this.#destinations,
      offers: this.#offers,
      onBtnUnfoldClick() {
        replaceWaypointToEditedWaypoint();
        window.document.addEventListener('keydown', escKeydownHandler);
      },
    });

    const waypointEditComponent = new WaypointEditView({
      waypoint: waypoint,
      destinations: this.#destinations,
      offers: this.#offers,
      onBtnFoldClick() {
        replaceEditedWaypointToWaypoint();
        window.document.removeEventListener('keydown', escKeydownHandler);
      },
    });

    render(waypointComponent, this.#eventsListComponent.element);

    function replaceWaypointToEditedWaypoint() {
      replace(waypointEditComponent, waypointComponent);
    }

    function replaceEditedWaypointToWaypoint() {
      replace(waypointComponent, waypointEditComponent);
    }
  }
}
