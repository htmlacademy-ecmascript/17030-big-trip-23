import { render } from './framework/render';
import TripPresenter from './presenter/trip-presenter';
import WaypointsModel from './model/waypoints-model';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import NewEventButtonView from './view/new-event-button-view';
import WaypointsApiService from './waypoints-api-service';
import TripInfoPresenter from './presenter/trip-info-presenter';

const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic k2ljdfklf34542fg';

const headerContainerElement = document.querySelector('.page-body');
const filterContainerElement = headerContainerElement.querySelector('.trip-controls__filters');
const tripMainElement = headerContainerElement.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

const waypointsApiService = new WaypointsApiService(END_POINT, AUTHORIZATION);

const waypointsModel = new WaypointsModel({ waypointsApiService });
const destinationsModel = new DestinationsModel({ waypointsApiService });
const offersModel = new OffersModel({ waypointsApiService });
const filterModel = new FilterModel();

new TripInfoPresenter({
  tripInfoContainerElement: tripMainElement,
  waypointsModel,
  destinationsModel,
  offersModel,
});
const filterPresenter = new FilterPresenter({
  filterContainerElement,
  filterModel,
  waypointsModel,
});
const tripPresenter = new TripPresenter({
  containerElement: tripEventsElement,
  waypointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewEventDestroy: handleNewEventFormClose,
});

const newEventButtonComponent = new NewEventButtonView({
  onNewEventClick: handleNewEventBtnClick,
});

function handleNewEventFormClose() {
  newEventButtonComponent.element.disabled = false;
}

function handleNewEventBtnClick() {
  tripPresenter.createNewWaypoint();
  newEventButtonComponent.element.disabled = true;
}

render(newEventButtonComponent, tripMainElement);
filterPresenter.init();

const init = async () => {
  try {
    await Promise.all([
      destinationsModel.init(),
      offersModel.init(),
    ]);
    await waypointsModel.init();
  } catch (err) {
    tripPresenter.handleApiError();
  }
};

init();
