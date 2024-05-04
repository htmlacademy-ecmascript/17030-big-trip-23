import { render } from '../render';
import EventsListView from '../view/events-list-view';
import WaypointEditView from '../view/waypoint-edit-view';
import WaypointView from '../view/waypoint-view';
import SortingView from '../view/sorting-view';

export default class EventPresenter {
  constructor({ containerEl, waypointsModel, destinationsModel, offersModel }) {
    this.containerEl = containerEl;
    this.waypointsModel = waypointsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
  }

  renderSortingView() {
    this.sortingView = new SortingView();
    render(this.sortingView, this.containerEl);
  }

  renderEventsListView() {
    this.eventsListView = new EventsListView();
    render(this.eventsListView, this.containerEl);
  }

  renderWaypointEditView({ waypoint, destinations, offers }) {
    this.waypointEditView = new WaypointEditView({
      waypoint,
      destinations,
      offers,
    });
    render(this.waypointEditView, this.eventsListView.getElement());
  }

  renderWaypointView({ waypoint, destinations, offers }) {
    this.waypointView = new WaypointView({
      waypoint,
      destinations,
      offers,
    });
    render(this.waypointView, this.eventsListView.getElement());
  }

  init() {
    this.waypoints = [...this.waypointsModel.getWaypoints()];
    this.destinations = [...this.destinationsModel.getDestinations()];
    this.offers = [...this.offersModel.getOffers()];

    this.renderSortingView();
    this.renderEventsListView();
    this.renderWaypointEditView({
      waypoint: this.waypoints[0],
      destinations: this.destinations,
      offers: this.offers,
    });

    for (let i = 1; i < this.waypoints.length; i++) {
      this.renderWaypointView({
        waypoint: this.waypoints[i],
        destinations: this.destinations,
        offers: this.offers,
      });
    }

    render(this.eventsListView, this.containerEl);
  }
}
