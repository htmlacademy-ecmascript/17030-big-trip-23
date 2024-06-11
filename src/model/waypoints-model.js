import Observable from '../framework/observable';
import { UpdateType } from '../const';

export default class WaypointsModel extends Observable {
  #waypointsApiService = null;
  #waypoints = [];

  constructor({ waypointsApiService }) {
    super();
    this.#waypointsApiService = waypointsApiService;
  }

  get waypoints() {
    return this.#waypoints;
  }

  async init() {
    try {
      const waypoints = await this.#waypointsApiService.waypoints;
      this.#waypoints = waypoints.map(this.#adaptToClient);
    } catch (e) {
      this.#waypoints = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updateWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(({ id }) => id === update.id);

    if (index === -1) {
      throw new Error(`Cannot update unexisting waypoint with id ${update.id}`);
    }

    try {
      const response = await this.#waypointsApiService.updateWaypoint(update);
      const updatedWaypoint = this.#adaptToClient(response);
      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        updatedWaypoint,
        ...this.#waypoints.slice(index + 1),
      ];
      this._notify(updateType, update);
    } catch (e) {
      throw new Error(`Cannot update waypoint with id ${update.id}`);
    }
  }

  async addWaypoint(updateType, update) {
    try {
      const response = await this.#waypointsApiService.addWaypoint(update);
      const newWaypoint = this.#adaptToClient(response);
      this.#waypoints = [newWaypoint, ...this.#waypoints];
      this._notify(updateType, newWaypoint);
    } catch (e) {
      throw new Error(`Cannot add waypoint with id ${update.id}`);
    }
  }

  async removeWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(({ id }) => id === update.id);

    if (index === -1) {
      throw new Error(`Cannot remove unexisting waypoint with id ${update.id}`);
    }

    try {
      await this.#waypointsApiService.removeWaypoint(update);
      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        ...this.#waypoints.slice(index + 1),
      ];
      this._notify(updateType, update);
    } catch (e) {
      throw new Error(`Cannot remove waypoint with id ${update.id}`);
    }
  }

  #adaptToClient(waypoint) {
    const adaptedWaypoint = {
      ...waypoint,
      basePrice: waypoint['base_price'],
      dateFrom: waypoint['date_from'] !== null ? new Date(waypoint['date_from']) : waypoint['date_from'],
      dateTo: waypoint['date_to'] !== null ? new Date(waypoint['date_to']) : waypoint['date_to'],
      isFavorite: waypoint['is_favorite'],
    };

    delete adaptedWaypoint['base_price'];
    delete adaptedWaypoint['date_from'];
    delete adaptedWaypoint['date_to'];
    delete adaptedWaypoint['is_favorite'];

    return adaptedWaypoint;
  }
}
