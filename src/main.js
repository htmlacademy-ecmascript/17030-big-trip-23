import FiltersView from './view/filters-view';
import SortingView from './view/sorting-view';
import Presenter from './presenter/presenter';

const tripControlsFiltersEl = document.querySelector('.trip-controls__filters');
const tripEventsEl = document.querySelector('.trip-events');
const presenter = new Presenter();

tripControlsFiltersEl.append(new FiltersView().getElement());
tripEventsEl.append(new SortingView().getElement());

presenter.init();
