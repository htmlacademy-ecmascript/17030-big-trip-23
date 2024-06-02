import { render } from './framework/render';
import TripPresenter from './presenter/trip-presenter';
import WaypointsModel from './model/waypoints-model';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import NewEventButtonView from './view/new-event-button-view';
import WaypointsApiService from './waypoints-api-service';

const END_POINT = 'http://21.objects.pages.academy/big-trip';
const AUTHORIZATION = 'Basic k2ljdfklsjf34542fg';

const headerContainerEl = document.querySelector('.page-body');
const filterContainerEl = headerContainerEl.querySelector('.trip-controls__filters');
const newButtonContainerEl = headerContainerEl.querySelector('.trip-main');
const tripEventsEl = document.querySelector('.trip-events');

const waypointsModel = new WaypointsModel({
  waypointsApiService: new WaypointsApiService(END_POINT, AUTHORIZATION),
});
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();

const newEventButtonComponent = new NewEventButtonView({
  onNewEventClick: handleNewEventBtnClick,
});

const filterPresenter = new FilterPresenter({
  filterContainerEl,
  filterModel,
  waypointsModel,
});

const tripPresenter = new TripPresenter({
  containerEl: tripEventsEl,
  waypointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewEventDestroy: handleNewEventFormClose,
});

function handleNewEventFormClose() {
  newEventButtonComponent.element.disabled = false;
}

function handleNewEventBtnClick() {
  tripPresenter.createNewWaypoint();
  newEventButtonComponent.element.disabled = true;
}

render(newEventButtonComponent, newButtonContainerEl);

filterPresenter.init();
tripPresenter.init();
