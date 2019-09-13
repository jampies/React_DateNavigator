import {
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  startOfYear,
  getISODay,
  addMinutes,
  subYears,
  addYears,
  addWeeks,
  endOfYear,
  parse,
  getMonth as getMonthDateFns,
  isAfter,
  isBefore,
  isSameDay,
  isSameWeek,
  getTime,
  getDate,
  getYear,
  startOfDay,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameYear,
  addMilliseconds,
  addSeconds,
  addMonths,
  subWeeks,
  differenceInMilliseconds,
  toDate
} from 'date-fns';
import Date from "./dateWrapper";

function getCurrentDate() {
  return new Date();
}

const overridedDateFns = {
  getCurrentDate,

  getNewDate: (date) => {
    return toDate(date);
  },

  getStartOfWeek (date) {
    return startOfWeek(date, { weekStartsOn: 1 });
  },

  getEndOfWeek (date) {
    return endOfWeek(date, { weekStartsOn: 1 });
  },

  getMinimumDate: () => {
    return startOfYear(subYears(getCurrentDate(), 1));
  },

  getMaximumDate: () => {
    return endOfYear(addYears(getCurrentDate(), 3));
  },

  getDayOfWeek: date => {
    return getISODay(date) - 1;
  },

  getMonth: (date) => getMonthDateFns(date) + 1,

  isBetweenDays: (date, startDate, endDate) => {
    return isSameDay(date, startDate) ||
      isSameDay(date, endDate) || (
        isAfter(date, startDate) &&
        isBefore(date, endDate)
      );
  }
};

export default {
  addDays,
  format,
  startOfYear,
  getISODay,
  addMinutes,
  subYears,
  addYears,
  addWeeks,
  endOfYear,
  parse,
  isAfter,
  isBefore,
  isSameDay,
  isSameWeek,
  getTime,
  getDate,
  getYear,
  startOfDay,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameYear,
  addMilliseconds,
  addSeconds,
  addMonths,
  subWeeks,
  differenceInMilliseconds,
  ...overridedDateFns
};
