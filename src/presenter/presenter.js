import { render } from '../render';
import EventsListView from '../view/events-list-view';
import EventCreateView from '../view/event-create-view';
import EventEditView from '../view/event-edit-view';
import EventItemView from '../view/event-item-view';
import SortingView from '../view/sorting-view';

export default class Presenter {
  constructor({ containerEl }) {
    this.containerEl = containerEl;
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

  renderEventCreateView() {
    this.eventCreateView = new EventCreateView();
    render(this.eventCreateView, this.eventsListView.getElement());
  }

  renderEventItemView() {
    this.eventItemView = new EventItemView();
    render(this.eventItemView, this.eventsListView.getElement());
  }

  init() {
    this.renderSortingView();
    this.renderEventsListView();
    this.renderEventEditView();
    this.renderEventCreateView();

    for (let i = 0; i < 3; i++) {
      this.renderEventItemView();
    }

    render(this.eventsListView, this.containerEl);
  }
}
