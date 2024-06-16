export default class DestinationsModel {
  #destinations = [];
  #waypointsApiService = null;

  constructor({ waypointsApiService }) {
    this.#waypointsApiService = waypointsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#waypointsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }
  }
}
