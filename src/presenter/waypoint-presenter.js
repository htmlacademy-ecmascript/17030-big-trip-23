import WaypointView from '../view/waypoint-view';
import WaypointEditView from '../view/waypoint-edit-view';
import { remove, render, replace } from '../framework/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class WaypointPresenter {
  #waypointsContainerEl = null;
  #destinations = [];
  #offers = [];
  #waypoint = null;
  #waypointComponent = null;
  #waypointEditComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ waypointsContainerEl, destinations, offers, onDataChange, onModeChange }) {
    this.#waypointsContainerEl = waypointsContainerEl;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(waypoint) {
    this.#waypoint = waypoint;

    const prevWaypointComponent = this.#waypointComponent;
    const prevWaypointEditComponent = this.#waypointEditComponent;

    this.#waypointComponent = new WaypointView({
      waypoint: waypoint,
      destinations: this.#destinations,
      offers: this.#offers,
      onBtnUnfoldClick: this.#handleBtnUnfoldClick,
      onBtnAddToFavoriteClick: this.#handleFavoriteClick,
    });
    this.#waypointEditComponent = new WaypointEditView({
      waypoint: waypoint,
      destinations: this.#destinations,
      offers: this.#offers,
      onBtnFoldClick: this.#handleBtnFoldClick,
      onSubmit: this.#handleFormSubmit,
      onReset: this.#handleFormReset,
    });

    if (prevWaypointComponent === null || prevWaypointEditComponent === null) {
      render(this.#waypointComponent, this.#waypointsContainerEl);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#waypointEditComponent, prevWaypointEditComponent);
    }

    remove(prevWaypointComponent);
    remove(prevWaypointEditComponent);
  }

  destroy() {
    remove(this.#waypointComponent);
    remove(this.#waypointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditedWaypointToWaypoint();
    }
  }

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditedWaypointToWaypoint();
    }
  };

  #handleBtnUnfoldClick = () => {
    this.#replaceWaypointToEditedWaypoint();
  };

  #handleBtnFoldClick = () => {
    this.#replaceEditedWaypointToWaypoint();
  };

  #handleFormSubmit = () => {
    this.#replaceEditedWaypointToWaypoint();
  };

  #handleFormReset = () => {
    this.#replaceEditedWaypointToWaypoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({ ...this.#waypoint, isFavorite: !this.#waypoint.isFavorite });
  };

  #replaceWaypointToEditedWaypoint = () => {
    replace(this.#waypointEditComponent, this.#waypointComponent);
    document.addEventListener('keydown', this.#escKeydownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceEditedWaypointToWaypoint = () => {
    replace(this.#waypointComponent, this.#waypointEditComponent);
    document.removeEventListener('keydown', this.#escKeydownHandler);
    this.#mode = Mode.DEFAULT;
  };
}
