export default class OffersModel {
  #offers = [];
  #waypointsApiService = null;

  constructor({ waypointsApiService }) {
    this.#waypointsApiService = waypointsApiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      this.#offers = await this.#waypointsApiService.offers;
    } catch (e) {
      this.#offers = [];
    }
  }
}
