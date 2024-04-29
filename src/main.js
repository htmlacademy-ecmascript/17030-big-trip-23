import { render } from './render';
import FiltersView from './view/filters-view';
import EventPresenter from './presenter/event-presenter';
import WaypointsModel from './model/waypoints-model';

const tripControlsFiltersEl = document.querySelector('.trip-controls__filters');
const tripEventsEl = document.querySelector('.trip-events');
const waypointsModel = new WaypointsModel();
const eventPresenter = new EventPresenter({
  containerEl: tripEventsEl,
  waypointsModel,
});

render(new FiltersView(), tripControlsFiltersEl);

eventPresenter.init();
