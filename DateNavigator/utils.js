import dateService from '../helpers/dateFns/dateFns';
const { startOfMonth, getStartOfWeek, endOfMonth, getEndOfWeek, getDayOfWeek, getDate, getMonth, getNewDate, isSameDay, addDays, isAfter } = dateService;

export const dateFromYear = year => new Date(year, 0, 1);

export const dateFromMonth = (year, month) => {
  return new Date(year, month - 1, 1);
};

export const getWeeksInMonth = (currentDate, year, month) => {
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
};
