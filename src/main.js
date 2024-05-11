import { render } from './framework/render';
import FiltersView from './view/filters-view';
import EventPresenter from './presenter/event-presenter';
import WaypointsModel from './model/waypoints-model';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';
import { FilterType } from './const';
import { generateFilter } from './mock/filter';

const tripControlsFiltersEl = document.querySelector('.trip-controls__filters');
const tripEventsEl = document.querySelector('.trip-events');

const waypointsModel = new WaypointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const activeFilter = FilterType.EVERYTHING;
const filters = generateFilter(waypointsModel.waypoints);

const eventPresenter = new EventPresenter({
  containerEl: tripEventsEl,
  waypointsModel,
  destinationsModel,
  offersModel,
  activeFilter,
});

render(new FiltersView({ filters, activeFilter }), tripControlsFiltersEl);

eventPresenter.init();
