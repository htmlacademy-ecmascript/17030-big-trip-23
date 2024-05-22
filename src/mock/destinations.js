import { getRandomArrayItem, getRandomPositiveInteger } from '../utils/common';

const PHOTO_ADDRESS = 'https://loremflickr.com/248/152?random=';
const PHOTO_DESCRIPTIONS = [
  'Chamonix parliament building',
  'Scenic mountain overlook',
  'Colorful city streets',
  'Remote desert landscape',
  'Beautiful beach sunset',
  'Historic landmark close-up',
  'Lush tropical jungle',
  'Snow-covered mountain peak',
  'Vibrant urban skyline',
  'Peaceful riverside reflection',
];

const createRandomPicture = () => {
  const number = getRandomPositiveInteger(0, 10);
  const src = `${PHOTO_ADDRESS}${number}`;
  const description = getRandomArrayItem(PHOTO_DESCRIPTIONS);

  return { src, description };
};

const generatePictures = (count) => Array.from({ length: count }, createRandomPicture);

const mockDestinations = [
  {
    id: '1',
    name: 'Amsterdam',
    description: 'Amsterdam is known for its picturesque canals, historic architecture, and vibrant arts scene.',
    pictures: generatePictures(2),
  },
  {
    id: '2',
    name: 'Geneva',
    description: 'Geneva is a cosmopolitan city in Switzerland, famous for its stunning lake, international organizations, and luxury watchmakers.',
    pictures: generatePictures(4),
  },
  {
    id: '3',
    name: 'Chamonix',
    description: 'Chamonix is a popular destination in the French Alps known for its ski resorts, views of Mont Blanc, and outdoor activities like skiing, snowboarding, hiking, and mountaineering.',
    pictures: generatePictures(6),
  },
];

const getDestinations = () => mockDestinations;

const getDestinationIdByName = (destinationName) => mockDestinations.find(({ name }) => name === destinationName)?.id ?? null;

export { getDestinations, getDestinationIdByName };
