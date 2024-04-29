const mockDestinations = [
  {
    id: 1,
    name: 'Amsterdam',
    description: 'Amsterdam is known for its picturesque canals, historic architecture, and vibrant arts scene.',
  },
  {
    id: 2,
    name: 'Geneva',
    description: 'Geneva is a cosmopolitan city in Switzerland, famous for its stunning lake, international organizations, and luxury watchmakers.',
  },
  {
    id: 3,
    name: 'Chamonix',
    description: 'Chamonix is a popular destination in the French Alps known for its ski resorts, views of Mont Blanc, and outdoor activities like skiing, snowboarding, hiking, and mountaineering.',
  },
];

const getDestinationById = (destinationId) => mockDestinations.find(({ id }) => id === destinationId);

export { getDestinationById };
