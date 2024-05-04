import { getRandomWaypoint } from '../mock/waypoints';

const WAYPOINTS_COUNT = 4;

export default class WaypointsModel {
  waypoints = Array.from({ length: WAYPOINTS_COUNT }, getRandomWaypoint);

  getWaypoints() {
    return this.waypoints;
  }
}
