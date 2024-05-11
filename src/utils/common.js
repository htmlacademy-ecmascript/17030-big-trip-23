const getRandomPositiveInteger = (min, max) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

const getRandomArrayItem = (elements) => elements[getRandomPositiveInteger(0, elements.length - 1)];

const capitaliseFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export {
  getRandomArrayItem,
  getRandomPositiveInteger,
  capitaliseFirstLetter,
};
