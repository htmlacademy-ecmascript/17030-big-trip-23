import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

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

const printDuration = (start, end) => {
  const dateStart = dayjs(start);
  const dateEnd = dayjs(end);

  const diff = dateEnd.diff(dateStart);
  const diffDuration = dayjs.duration(diff);

  const daysDuration = diffDuration.days();
  const hoursDuration = diffDuration.hours();
  const minutesDuration = diffDuration.minutes();

  const days = `${daysDuration.toString().padStart(2, '0')}D`;
  const hours = `${hoursDuration.toString().padStart(2, '0')}H`;
  const minutes = `${minutesDuration.toString().padStart(2, '0')}M`;

  if (daysDuration) {
    return `${days} ${hours} ${minutes}`;
  }

  if (hoursDuration) {
    return `${hours} ${minutes}`;
  }

  return minutes;
};

export {
  getRandomPositiveInteger,
  getRandomArrayItem,
  capitaliseFirstLetter,
  getDateStringFromDate,
  getTimeStringFromDate,
  humanizeDay,
  humanizeDate,
  printDuration,
};
