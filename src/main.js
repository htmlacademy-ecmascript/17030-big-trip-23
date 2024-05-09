import { render } from './framework/render';
import FiltersView from './view/filters-view';
import EventPresenter from './presenter/event-presenter';
import WaypointsModel from './model/waypoints-model';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';

const tripControlsFiltersEl = document.querySelector('.trip-controls__filters');
const tripEventsEl = document.querySelector('.trip-events');

const waypointsModel = new WaypointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const eventPresenter = new EventPresenter({
  containerEl: tripEventsEl,
  waypointsModel,
  destinationsModel,
  offersModel,
});

render(new FiltersView(), tripControlsFiltersEl);

eventPresenter.init();
