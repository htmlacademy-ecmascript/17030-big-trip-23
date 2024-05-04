import { getDestinations } from '../mock/destinations';

export default class DestinationsModel {
  destinations = getDestinations();

  getDestinations() {
    return this.destinations;
  }
}
