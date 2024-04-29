import { render } from '../render';
import EventsListView from '../view/events-list-view';
import EventEditView from '../view/event-edit-view';
import WaypointView from '../view/waypoint-view';
import SortingView from '../view/sorting-view';

export default class EventPresenter {
  constructor({ containerEl, waypointsModel }) {
    this.containerEl = containerEl;
    this.waypointsModel = waypointsModel;
  }

  renderSortingView() {
    this.sortingView = new SortingView();
    render(this.sortingView, this.containerEl);
  }

  renderEventsListView() {
    this.eventsListView = new EventsListView();
    render(this.eventsListView, this.containerEl);
  }

  renderEventEditView() {
    this.eventEditView = new EventEditView();
    render(this.eventEditView, this.eventsListView.getElement());
  }

  renderWaypointView(waypoint) {
    this.waypointView = new WaypointView(waypoint);
    render(this.waypointView, this.eventsListView.getElement());
  }

  init() {
    this.waypoints = [...this.waypointsModel.getWaypoints()];

    this.renderSortingView();
    this.renderEventsListView();
    this.renderEventEditView();

    for (let i = 0; i < this.waypoints.length; i++) {
      this.renderWaypointView(this.waypoints[i]);
    }

    render(this.eventsListView, this.containerEl);
  }
}
