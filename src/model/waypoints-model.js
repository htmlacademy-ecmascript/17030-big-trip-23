import Observable from '../framework/observable';
import { getRandomWaypoint } from '../mock/waypoints';

const WAYPOINTS_COUNT = 4;

export default class WaypointsModel extends Observable {
  #waypointsApiService = null;
  #waypoints = Array.from({ length: WAYPOINTS_COUNT }, getRandomWaypoint);

  constructor({ waypointsApiService }) {
    super();
    this.#waypointsApiService = waypointsApiService;

    this.#waypointsApiService.waypoints.then((waypoints) => {
      console.log(waypoints.map(this.#adaptToClient));
    });
  }

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

  #adaptToClient(waypoint) {
    const adaptedWaypoint = {
      ...waypoint,
      basePrice: waypoint['base_price'],
      dateFrom: waypoint['date_from'] !== null ? new Date(waypoint['date_from']) : waypoint['date_from'],
      dateTo: waypoint['date_to'] !== null ? new Date(waypoint['date_to']) : waypoint['date_to'],
      isFavorite: waypoint['is_favorite'],
    };

    delete waypoint['base_price'];
    delete waypoint['date_from'];
    delete waypoint['date_to'];
    delete waypoint['is_favorite'];

    return adaptedWaypoint;
  }
}
