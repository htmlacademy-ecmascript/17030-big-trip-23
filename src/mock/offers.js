import { WaypointEventType } from '../const';

const mockOffers = [
  {
    type: WaypointEventType.TAXI,
    offers: [
      {
        id: 1,
        key: 'luggage',
        title: 'Add luggage',
        price: 50,
      },
      {
        id: 2,
        key: 'comfort',
        title: 'Switch to comfort',
        price: 80,
      },
      {
        id: 3,
        key: 'meal',
        title: 'Add meal',
        price: 15,
      },
      {
        id: 5,
        key: 'train',
        title: 'Travel by train',
        price: 40,
      },
      {
        id: 6,
        key: 'uber',
        title: 'Order Uber',
        price: 20,
      },
      {
        id: 7,
        key: 'Lunch',
        title: 'Lunch in city',
        price: 30,
      },
    ],
  },
  {
    type: WaypointEventType.BUS,
    offers: [
      {
        id: 1,
        key: 'luggage',
        title: 'Add luggage',
        price: 60,
      },
      {
        id: 2,
        key: 'comfort',
        title: 'Switch to comfort',
        price: 120,
      },
      {
        id: 3,
        key: 'meal',
        title: 'Add meal',
        price: 54,
      },
      {
        id: 4,
        key: 'train',
        title: 'Travel by train',
        price: 73,
      },
    ],
  },
  {
    type: WaypointEventType.FLIGHT,
    offers: [
      {
        id: 1,
        key: 'luggage',
        title: 'Add luggage',
        price: 60,
      },
      {
        id: 2,
        key: 'comfort',
        title: 'Switch to comfort',
        price: 120,
      },
      {
        id: 3,
        key: 'meal',
        title: 'Add meal',
        price: 54,
      },
      {
        id: 4,
        key: 'train',
        title: 'Travel by train',
        price: 73,
      },
    ],
  },
  {
    type: WaypointEventType.RESTAURANT,
    offers: [
      {
        id: 1,
        key: 'luggage',
        title: 'Add luggage',
        price: 60,
      },
      {
        id: 2,
        key: 'comfort',
        title: 'Switch to comfort',
        price: 120,
      },
      {
        id: 3,
        key: 'meal',
        title: 'Add meal',
        price: 54,
      },
      {
        id: 4,
        key: 'train',
        title: 'Travel by train',
        price: 73,
      },
    ],
  },
];

const getOffers = () => mockOffers;

export { getOffers };
