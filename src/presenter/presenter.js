import EventsListView from '../view/events-list-view';
import EventCreateView from '../view/event-create-view';
import EventEditView from '../view/event-edit-view';
import EventItemView from '../view/event-item-view';

export default class Presenter {
  init() {
    const tripEventsEl = document.querySelector('.trip-events');
    const eventsListEl = new EventsListView().getElement();

    eventsListEl.append(new EventCreateView().getElement());
    eventsListEl.append(new EventEditView().getElement());
    Array.from({length: 3}, () => {
      eventsListEl.append(new EventItemView().getElement());
    });

    tripEventsEl.append(eventsListEl);
  }
}
