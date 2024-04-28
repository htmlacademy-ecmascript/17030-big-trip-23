const getRandomPositiveInteger = (min, max) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

const getRandomArrayItem = (elements) => elements[getRandomPositiveInteger(0, elements.length - 1)];

const capitaliseFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const getDateStringFromDate = (date) => {
  const [dateComponent] = date.toISOString().split('T');
  return dateComponent;
};

const getTimeFromDate = (date) => {
  const hours = date.getHours().toString(10);
  const minutes = date.getMinutes().toString(10);

  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

export {
  getRandomArrayItem,
  capitaliseFirstLetter,
  getDateStringFromDate,
  getTimeFromDate,
};
