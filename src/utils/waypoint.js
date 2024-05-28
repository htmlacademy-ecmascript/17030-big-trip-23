import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const MONTH_DAY_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';
const ISO_DATE_FORMAT = 'YYYY-MM-DD';
const DATE_FORMAT = `DD/MM/YY ${TIME_FORMAT}`;

const getDateStringFromDate = (date) => date ? dayjs(date).format(ISO_DATE_FORMAT) : '';

const getTimeStringFromDate = (date) => date ? dayjs(date).format(TIME_FORMAT) : '';

const humanizeDay = (date) => date ? dayjs(date).format(MONTH_DAY_FORMAT) : '';

const humanizeDate = (date) => date ? dayjs(date).format(DATE_FORMAT) : '';

const getDiffDuration = (start, end) => {
  const dateStart = dayjs(start);
  const dateEnd = dayjs(end);
  const diff = dateEnd.diff(dateStart);

  return dayjs.duration(diff);
};

const printDuration = (start, end) => {
  const diffDuration = getDiffDuration(start, end);

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

const isEventInPast = (event) => dayjs().isAfter(event.dateTo);

const isEventInPresent = (event) => dayjs().isSameOrAfter(event.dateFrom) && dayjs().isSameOrBefore(event.dateTo);

const isEventInFuture = (event) => dayjs().isAfter(event.dateFrom);

const sortByDay = (a, b) => {
  const dateA = dayjs(a.dateFrom);
  const dateB = dayjs(b.dateFrom);

  return dateB.diff(dateA, 'days');
};

const sortByPrice = (a, b) => b.basePrice - a.basePrice;

const sortByTime = (a, b) => {
  const durationA = getDiffDuration(a.dateFrom, a.dateTo);
  const durationB = getDiffDuration(b.dateFrom, b.dateTo);

  return durationB.asSeconds() - durationA.asSeconds();
};

export {
  getDateStringFromDate,
  getTimeStringFromDate,
  humanizeDay,
  humanizeDate,
  printDuration,
  isEventInPast,
  isEventInPresent,
  isEventInFuture,
  sortByDay,
  sortByPrice,
  sortByTime,
};
