import TripInfoView from '../view/trip-info-view';
import { remove, render, RenderPosition, replace } from '../framework/render';
import { sortByDay } from '../utils/waypoint';

export default class TripInfoPresenter {
  #tripInfoContainerElement = null;
  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #tripInfoComponent = null;

  constructor({ tripInfoContainerElement, waypointsModel, destinationsModel, offersModel }) {
    this.#tripInfoContainerElement = tripInfoContainerElement;
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
  }

  get waypoints() {
    return [...this.#waypointsModel.waypoints].sort(sortByDay);
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offers() {
    return this.#offersModel.offers;
  }

  init() {
    if (!this.waypoints?.length) {
      remove(this.#tripInfoComponent);
      return;
    }

    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView({
      waypoints: this.waypoints,
      destinations: this.destinations,
      offers: this.offers,
    });

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainerElement, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };
}
