import FiltersView from './view/filters-view';
import Presenter from './presenter/presenter';

const tripControlsFiltersEl = document.querySelector('.trip-controls__filters');
const tripEventsEl = document.querySelector('.trip-events');
const presenter = new Presenter({
  containerEl: tripEventsEl,
});

tripControlsFiltersEl.append(new FiltersView().getElement());

presenter.init();
