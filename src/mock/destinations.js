import { getRandomPositiveInteger } from '../utils';

const PHOTO_ADDRESS = 'https://loremflickr.com/248/152?random=';

const getRandomPhotoUrl = () => {
  const number = getRandomPositiveInteger(0, 10);
  return `${PHOTO_ADDRESS}${number}`;
};

const generatePhotoUrls = (count) => Array.from({ length: count }, getRandomPhotoUrl);

const mockDestinations = [
  {
    id: 1,
    name: 'Amsterdam',
    description: 'Amsterdam is known for its picturesque canals, historic architecture, and vibrant arts scene.',
    photos: generatePhotoUrls(2),
  },
  {
    id: 2,
    name: 'Geneva',
    description: 'Geneva is a cosmopolitan city in Switzerland, famous for its stunning lake, international organizations, and luxury watchmakers.',
    photos: generatePhotoUrls(4),
  },
  {
    id: 3,
    name: 'Chamonix',
    description: 'Chamonix is a popular destination in the French Alps known for its ski resorts, views of Mont Blanc, and outdoor activities like skiing, snowboarding, hiking, and mountaineering.',
    photos: generatePhotoUrls(6),
  },
];

const getDestinationById = (destinationId) => mockDestinations.find(({ id }) => id === destinationId);

export { getDestinationById };
