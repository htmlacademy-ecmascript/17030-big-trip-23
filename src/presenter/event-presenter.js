import { render, replace } from '../framework/render';
import EventsListView from '../view/events-list-view';
import WaypointEditView from '../view/waypoint-edit-view';
import WaypointView from '../view/waypoint-view';
import SortingView from '../view/sorting-view';
import EmptyEventsView from '../view/empty-events-view';
import FailedLoadView from '../view/failed-load-view';
import LoadingView from '../view/loading-view';

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

    for (let i = 0; i < this.#waypoints.length; i++) {
      this.#renderWaypoint(this.#waypoints[i]);
    }
  }

  #renderEmptyEventComponent() {
    const emptyEventsComponent = new EmptyEventsView({ activeFilter: this.#activeFilter });
    render(emptyEventsComponent, this.#containerEl);
  }

  #renderWaypoint(waypoint) {
    const escKeydownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditedWaypointToWaypoint();
        document.removeEventListener('keydown', escKeydownHandler);
      }
    };

    const waypointComponent = new WaypointView({
      waypoint: waypoint,
      destinations: this.#destinations,
      offers: this.#offers,
      onBtnUnfoldClick() {
        replaceWaypointToEditedWaypoint();
        document.addEventListener('keydown', escKeydownHandler);
      },
    });

    const waypointEditComponent = new WaypointEditView({
      waypoint: waypoint,
      destinations: this.#destinations,
      offers: this.#offers,
      onBtnFoldClick() {
        replaceEditedWaypointToWaypoint();
        document.removeEventListener('keydown', escKeydownHandler);
      },
      onSubmit() {
        replaceEditedWaypointToWaypoint();
        document.removeEventListener('keydown', escKeydownHandler);
      },
      onReset() {
        replaceEditedWaypointToWaypoint();
        document.removeEventListener('keydown', escKeydownHandler);
      },
    });

    function replaceWaypointToEditedWaypoint() {
      replace(waypointEditComponent, waypointComponent);
    }

    function replaceEditedWaypointToWaypoint() {
      replace(waypointComponent, waypointEditComponent);
    }

    render(waypointComponent, this.#eventsListComponent.element);
  }
}
