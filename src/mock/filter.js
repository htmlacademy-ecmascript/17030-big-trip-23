import { filter } from '../utils/filter';

const generateFilter = (waypoints) => Object.entries(filter).map(
  ([filterType, filterWaypointsFn]) => ({
    type: filterType,
    hasItems: Boolean(filterWaypointsFn(waypoints).length),
  }),
);

export { generateFilter };
