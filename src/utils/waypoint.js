import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const DateFormat = {
  MONTH_DAY: 'MMM D',
  DAY_MONTH: 'D MMM',
  TIME: 'HH:mm',
  ISO_DATE: 'YYYY-MM-DD',
  DATE: 'DD/MM/YY HH:mm',
};

const getDateStringFromDate = (date) => date ? dayjs(date).format(DateFormat.ISO_DATE) : '';

const getTimeStringFromDate = (date) => date ? dayjs(date).format(DateFormat.TIME) : '';

const humanizeMonthDay = (date) => date ? dayjs(date).format(DateFormat.MONTH_DAY) : '';

const humanizeDayMonth = (date) => date ? dayjs(date).format(DateFormat.DAY_MONTH) : '';

const humanizeDate = (date) => date ? dayjs(date).format(DateFormat.DATE) : '';

const getDiffDuration = (start, end) => {
  const dateStart = dayjs(start);
  const dateEnd = dayjs(end);
  const diff = dateEnd.diff(dateStart);

  return dayjs.duration(diff);
};

const printDuration = (start, end) => {
  const diffDuration = getDiffDuration(start, end);

  const daysDuration = Math.floor(diffDuration.asDays());
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

const printTripDuration = (start, end) => {
  const beginningDate = start ? dayjs(start) : '';
  const finishingDate = end ? dayjs(end) : '';

  if (!(beginningDate || finishingDate)) {
    return '';
  }

  return `${humanizeDayMonth(beginningDate)}&nbsp;&mdash;&nbsp;${humanizeDayMonth(finishingDate)}`;
};

const isEventInPast = (event) => dayjs().isAfter(event.dateTo);

const isEventInPresent = (event) => dayjs().isSameOrAfter(event.dateFrom) && dayjs().isSameOrBefore(event.dateTo);

const isEventInFuture = (event) => dayjs().isBefore(event.dateFrom);

const sortByDay = (eventA, eventB) => {
  const dateA = dayjs(eventA.dateFrom);
  const dateB = dayjs(eventB.dateFrom);

  return dateA.diff(dateB, 'D');
};

const sortByPrice = (eventA, eventB) => eventB.basePrice - eventA.basePrice;

const sortByTime = (eventA, eventB) => {
  const durationA = getDiffDuration(eventA.dateFrom, eventA.dateTo);
  const durationB = getDiffDuration(eventB.dateFrom, eventB.dateTo);

  return durationB.asSeconds() - durationA.asSeconds();
};

export {
  getDateStringFromDate,
  getTimeStringFromDate,
  humanizeMonthDay,
  humanizeDate,
  printDuration,
  printTripDuration,
  isEventInPast,
  isEventInPresent,
  isEventInFuture,
  sortByDay,
  sortByPrice,
  sortByTime,
};
