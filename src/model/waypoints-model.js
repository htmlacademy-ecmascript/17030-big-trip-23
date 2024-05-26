import Observable from '../framework/observable';
import { getRandomWaypoint } from '../mock/waypoints';

const WAYPOINTS_COUNT = 4;

export default class WaypointsModel extends Observable {
  #waypoints = Array.from({ length: WAYPOINTS_COUNT }, getRandomWaypoint);

  get waypoints() {
    return this.#waypoints;
  }

  updateWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(({ id }) => id === update.id);

    if (index === -1) {
      throw new Error(`Cannot update waypoint with id ${update.id}`);
    }

    this.#waypoints.splice(index, 1, update);

    this._notify(updateType, update);
  }

  addWaypoint(updateType, update) {
    this.#waypoints.unshift(update);

    this._notify(updateType, update);
  }

  removeWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(({ id }) => id === update.id);

    if (index === -1) {
      throw new Error(`Cannot remove waypoint with id ${update.id}`);
    }

    this.#waypoints.splice(index, 1);

    this._notify(updateType, update);
  }
}
