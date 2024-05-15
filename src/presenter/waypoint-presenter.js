import WaypointView from '../view/waypoint-view';
import WaypointEditView from '../view/waypoint-edit-view';
import { render, replace } from '../framework/render';

export default class WaypointPresenter {
  #waypointsContainerEl = null;
  #destinations = [];
  #offers = [];
  #waypoint = null;

  constructor({ waypointsContainerEl, destinations, offers, waypoint }) {
    this.#waypointsContainerEl = waypointsContainerEl;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#waypoint = waypoint;
  }

  init() {
    this.#renderWaypoint(this.#waypoint);
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

    render(waypointComponent, this.#waypointsContainerEl);
  }
}
