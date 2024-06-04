import { render } from './framework/render';
import TripPresenter from './presenter/trip-presenter';
import WaypointsModel from './model/waypoints-model';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import NewEventButtonView from './view/new-event-button-view';
import WaypointsApiService from './waypoints-api-service';

const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic k2ljdfklsjf34542fg';

const headerContainerEl = document.querySelector('.page-body');
const filterContainerEl = headerContainerEl.querySelector('.trip-controls__filters');
const newButtonContainerEl = headerContainerEl.querySelector('.trip-main');
const tripEventsEl = document.querySelector('.trip-events');

const waypointsApiService = new WaypointsApiService(END_POINT, AUTHORIZATION);

const waypointsModel = new WaypointsModel({ waypointsApiService });
const destinationsModel = new DestinationsModel({ waypointsApiService });
const offersModel = new OffersModel({ waypointsApiService });
const filterModel = new FilterModel();

const init = async () => {
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

  filterPresenter.init();
  tripPresenter.init();

  await destinationsModel.init();
  await offersModel.init();
  await waypointsModel.init();

  render(newEventButtonComponent, newButtonContainerEl);
};

init();
