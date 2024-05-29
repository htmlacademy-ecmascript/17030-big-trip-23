import TripPresenter from './presenter/trip-presenter';
import WaypointsModel from './model/waypoints-model';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';
import FilterModel from './model/filter-model';
import { FilterType } from './const';
import { generateFilter } from './mock/filter';
import HeaderPresenter from './presenter/header-presenter';

const headerContainerEl = document.querySelector('.page-body');
const tripEventsEl = document.querySelector('.trip-events');

const waypointsModel = new WaypointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();
const activeFilter = FilterType.EVERYTHING;
const filters = generateFilter(waypointsModel.waypoints);

const headerPresenter = new HeaderPresenter({
  containerEl: headerContainerEl,
  filters,
  activeFilter,
});

const tripPresenter = new TripPresenter({
  containerEl: tripEventsEl,
  waypointsModel,
  destinationsModel,
  offersModel,
  activeFilter,
});

headerPresenter.init();
tripPresenter.init();
