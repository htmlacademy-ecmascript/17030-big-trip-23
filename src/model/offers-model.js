import { getOffers } from '../mock/offers';

export default class OffersModel {
  offers = getOffers();

  getOffers() {
    return this.offers;
  }
}
