import dayjs from 'dayjs';

const MONTH_DAY_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';
const ISO_DATE_FORMAT = 'YYYY-MM-DD';
const DATE_FORMAT = `DD/MM/YY ${TIME_FORMAT}`;

const getRandomPositiveInteger = (min, max) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

const getRandomArrayItem = (elements) => elements[getRandomPositiveInteger(0, elements.length - 1)];

const capitaliseFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const getDateStringFromDate = (date) => date ? dayjs(date).format(ISO_DATE_FORMAT) : '';

const getTimeStringFromDate = (date) => date ? dayjs(date).format(TIME_FORMAT) : '';

const humanizeDay = (date) => date ? dayjs(date).format(MONTH_DAY_FORMAT) : '';

const humanizeDate = (date) => date ? dayjs(date).format(DATE_FORMAT) : '';

export {
  getRandomPositiveInteger,
  getRandomArrayItem,
  capitaliseFirstLetter,
  getDateStringFromDate,
  getTimeStringFromDate,
  humanizeDay,
  humanizeDate,
};
