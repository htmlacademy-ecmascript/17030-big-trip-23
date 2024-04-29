import { EventType } from '../const';
import { getRandomArrayItem } from '../utils';

const mockWaypoints = [
  {
    type: EventType.TAXI,
    timeStart: new Date('2023-03-18T10:30:00.000Z'),
    timeEnd: new Date('2023-03-18T11:00:00.000Z'),
    price: 1200,
    isFavorite: true,
    offerIds: [1, 2],
    destinationId: 1,
  },
  {
    type: EventType.BUS,
    timeStart: new Date('2023-08-06T12:25:00.000Z'),
    timeEnd: new Date('2023-08-08T13:35:00.000Z'),
    price: 769,
    isFavorite: false,
    offerIds: [3, 4, 7],
    destinationId: 2,
  },
  {
    type: EventType.RESTAURANT,
    timeStart: new Date('2023-05-01T12:25:00.000Z'),
    timeEnd: new Date('2023-05-01T13:35:00.000Z'),
    price: 541,
    isFavorite: false,
    offerIds: [1, 5, 6, 7],
    destinationId: 3,
  },
];

const getRandomWaypoint = () => getRandomArrayItem(mockWaypoints);

export { getRandomWaypoint };
