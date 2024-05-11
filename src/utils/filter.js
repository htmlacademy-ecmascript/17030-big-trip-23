import { FilterType } from '../const';
import { isEventInFuture, isEventInPast, isEventInPresent } from './waypoint';

const filter = {
  [FilterType.EVERYTHING]: (waypoints) => [...waypoints],
  [FilterType.PAST]: (waypoints) => waypoints.filter((waypoint) => isEventInPast(waypoint)),
  [FilterType.PRESENT]: (waypoints) => waypoints.filter((waypoint) => isEventInPresent(waypoint)),
  [FilterType.FUTURE]: (waypoints) => waypoints.filter((waypoint) => isEventInFuture(waypoint)),
};

export { filter };
