import { render } from './render';
import FiltersView from './view/filters-view';
import EventPresenter from './presenter/event-presenter';

const tripControlsFiltersEl = document.querySelector('.trip-controls__filters');
const tripEventsEl = document.querySelector('.trip-events');
const eventPresenter = new EventPresenter({
  containerEl: tripEventsEl,
});

render(new FiltersView(), tripControlsFiltersEl);

eventPresenter.init();
