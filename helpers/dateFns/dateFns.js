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

function getNewDate (date) {
  return toDate(date);
}

function dateFromYear(year) { 
  return new Date(year, 0, 1);
}

function dateFromMonth(year, month) {
  return new Date(year, month - 1, 1);
}

function getStartOfWeek (date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

function getEndOfWeek (date) {
  return endOfWeek(date, { weekStartsOn: 1 });
}

function getDayOfWeek(date) {
  return getISODay(date) - 1;
}

function getMonth (date){
  return getMonthDateFns(date) + 1
}

const overridedDateFns = {
  getCurrentDate,

  getNewDate,

  getStartOfWeek,

  getEndOfWeek,

  getMinimumDate: () => {
    return startOfYear(subYears(getCurrentDate(), 1));
  },

  getMaximumDate: () => {
    return endOfYear(addYears(getCurrentDate(), 3));
  },

  getDayOfWeek,

  getMonth,

  isBetweenDays: (date, startDate, endDate) => {
    return isSameDay(date, startDate) ||
      isSameDay(date, endDate) || (
        isAfter(date, startDate) &&
        isBefore(date, endDate)
      );
  },

  dateFromYear,

  dateFromMonth,

  getWeeksInMonth: (currentDate, year, month) => {
    const monthDate = dateFromMonth(year, month);
    const start = getStartOfWeek(startOfMonth(monthDate));
    const end = getEndOfWeek(endOfMonth(monthDate));
    let weeks = [];
    let week = -1;
    let day = start;
  
    while (!isAfter(day, end)) {
      if (getDayOfWeek(day) === 0 || weeks.length === 0) {
        weeks.push([]);
        week++;
      }
      let dayOfMonth = getDate(day);
      weeks[week].push(getMonth(day) === month ? { date: getNewDate(day), dayOfMonth, selected: isSameDay(day, currentDate) } : null);
      day = addDays(day, 1);
    }
    return weeks;
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
