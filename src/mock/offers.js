import { EventType } from '../const';

const mockOffers = [
  {
    type: EventType.TAXI,
    offers: [
      {
        id: 1,
        title: 'Add luggage',
        price: 50,
      },
      {
        id: 2,
        title: 'Switch to comfort',
        price: 80,
      },
      {
        id: 3,
        title: 'Add meal',
        price: 15,
      },
      {
        id: 5,
        title: 'Travel by train',
        price: 40,
      },
      {
        id: 6,
        title: 'Order Uber',
        price: 20,
      },
      {
        id: 7,
        title: 'Lunch in city',
        price: 30,
      },
    ],
  },
  {
    type: EventType.BUS,
    offers: [
      {
        id: 1,
        title: 'Add luggage',
        price: 60,
      },
      {
        id: 2,
        title: 'Switch to comfort',
        price: 120,
      },
      {
        id: 3,
        title: 'Add meal',
        price: 54,
      },
      {
        id: 4,
        title: 'Travel by train',
        price: 73,
      },
    ],
  },
  {
    type: EventType.RESTAURANT,
    offers: [
      {
        id: 1,
        title: 'Add luggage',
        price: 60,
      },
      {
        id: 2,
        title: 'Switch to comfort',
        price: 120,
      },
      {
        id: 3,
        title: 'Add meal',
        price: 54,
      },
      {
        id: 4,
        title: 'Travel by train',
        price: 73,
      },
    ],
  },
];

const getOffersByType = (waypointType) => (mockOffers.find(({ type }) => type === waypointType)?.offers) || [];

export { getOffersByType };
