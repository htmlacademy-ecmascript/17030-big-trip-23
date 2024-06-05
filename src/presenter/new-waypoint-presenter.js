import WaypointEditView from '../view/waypoint-edit-view';
import { UpdateType, UserAction } from '../const';
import { remove, render, RenderPosition } from '../framework/render';

export default class NewWaypointPresenter {
  #waypointsContainerEl = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #destinations = [];
  #offers = [];

  #waypointEditComponent = null;

  constructor({ waypointsContainerEl, onDataChange, onDestroy }) {
    this.#waypointsContainerEl = waypointsContainerEl;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init({ destinations, offers }) {
    this.#destinations = destinations;
    this.#offers = offers;

    if (this.#waypointEditComponent !== null) {
      return;
    }

    this.#waypointEditComponent = new WaypointEditView({
      destinations: this.#destinations,
      offers: this.#offers,
      onSubmit: this.#handleFormSubmit,
      onRemove: this.#handleRemoveClick,
    });

    render(this.#waypointEditComponent, this.#waypointsContainerEl, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeydownHandler);
  }

  destroy() {
    if (this.#waypointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#waypointEditComponent);
    this.#waypointEditComponent = null;

    document.addEventListener('keydown', this.#escKeydownHandler);
  }

  #handleFormSubmit = (waypoint) => {
    this.#handleDataChange(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      { ...waypoint },
    );
    this.destroy();
  };

  #handleRemoveClick = () => {
    this.destroy();
  };

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
