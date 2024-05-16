import { WaypointEventType } from '../const';
import { getRandomArrayItem } from '../utils/common';
import { nanoid } from 'nanoid';

const mockWaypoints = [
  {
    basePrice: 1110,
    dateFrom: '2023-03-18T10:30:00.000Z',
    dateTo: '2023-03-18T11:30:00.000Z',
    destination: '2',
    isFavorite: false,
    offers: ['4', '6'],
    type: WaypointEventType.TAXI,
  },
  {
    type: WaypointEventType.TAXI,
    dateFrom: '2023-03-18T10:30:00.000Z',
    dateTo: '2023-03-18T11:00:00.000Z',
    basePrice: 1200,
    isFavorite: true,
    offers: ['1', '2'],
    destination: '1',
  },
  {
    type: WaypointEventType.BUS,
    dateFrom: '2023-08-06T12:25:00.000Z',
    dateTo: '2023-08-08T13:35:00.000Z',
    basePrice: 769,
    isFavorite: false,
    offers: ['3', '4', '7'],
    destination: '2',
  },
  {
    type: WaypointEventType.RESTAURANT,
    dateFrom: '2023-05-01T12:25:00.000Z',
    dateTo: '2023-05-01T13:35:00.000Z',
    basePrice: 541,
    isFavorite: false,
    offers: ['1', '6', '7'],
    destination: '3',
  },
];

const getRandomWaypoint = () => ({
  id: nanoid(),
  ...getRandomArrayItem(mockWaypoints)
});

export { getRandomWaypoint };
