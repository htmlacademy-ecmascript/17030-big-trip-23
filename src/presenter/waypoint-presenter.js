import WaypointView from '../view/waypoint-view';
import WaypointEditView from '../view/waypoint-edit-view';
import { render, replace } from '../framework/render';

export default class WaypointPresenter {
  #waypointsContainerEl = null;
  #destinations = [];
  #offers = [];
  #waypoint = null;
  #waypointComponent = null;
  #waypointEditComponent = null;

  constructor({ waypointsContainerEl, destinations, offers }) {
    this.#waypointsContainerEl = waypointsContainerEl;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init(waypoint) {
    this.#waypoint = waypoint;
    this.#renderWaypoint(this.#waypoint);
  }

  #renderWaypoint(waypoint) {
    this.#waypointComponent = new WaypointView({
      waypoint: waypoint,
      destinations: this.#destinations,
      offers: this.#offers,
      onBtnUnfoldClick: this.#handleBtnUnfoldClick,
    });

    this.#waypointEditComponent = new WaypointEditView({
      waypoint: waypoint,
      destinations: this.#destinations,
      offers: this.#offers,
      onBtnFoldClick: this.#handleBtnFoldClick,
      onSubmit: this.#handleFormSubmit,
      onReset: this.#handleFormReset,
    });

    render(this.#waypointComponent, this.#waypointsContainerEl);
  }

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditedWaypointToWaypoint();
      document.removeEventListener('keydown', this.#escKeydownHandler);
    }
  };

  #handleBtnUnfoldClick = () => {
    this.#replaceWaypointToEditedWaypoint();
    document.addEventListener('keydown', this.#escKeydownHandler);
  };

  #handleBtnFoldClick = () => {
    this.#replaceEditedWaypointToWaypoint();
    document.removeEventListener('keydown', this.#escKeydownHandler);
  };

  #handleFormSubmit = () => {
    this.#replaceEditedWaypointToWaypoint();
    document.removeEventListener('keydown', this.#escKeydownHandler);
  };

  #handleFormReset = () => {
    this.#replaceEditedWaypointToWaypoint();
    document.removeEventListener('keydown', this.#escKeydownHandler);
  };

  #replaceWaypointToEditedWaypoint = () => {
    replace(this.#waypointEditComponent, this.#waypointComponent);
  };

  #replaceEditedWaypointToWaypoint = () => {
    replace(this.#waypointComponent, this.#waypointEditComponent);
  };
}
