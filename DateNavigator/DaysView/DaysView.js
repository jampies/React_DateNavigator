import React from 'react';
import styles from './DaysView.scss';
import { WEEKDAYS_ABBR } from '../../config/constants';
import { map, some } from 'lodash';
import { getWeeksInMonth, dateFromMonth } from '../utils';
import dateService from '../../helpers/dateFns/dateFns';
const { format } = dateService;

const Day = ({ day, onChange }) => {
  if (day) {
    return (
      <button className={`${styles.day} ${day.selected ? styles.selected : ''}`}
        onClick={() => onChange(day.date)}>
        { day.dayOfMonth }
      </button>
    );
  } else {
    return (
      <span className={styles.day} />
    );
  }
};

const WeekRow = ({ week, weekIndex, onChange }) => {
  let isSelected = some(week, day => day && day.selected);

  return <div className={`${styles.weekRow} ${isSelected ? styles.selected : ''}`}>
    {
      map(week, (day, dayIndex) => (
        <Day key={`${weekIndex}-${dayIndex}`} day={day} onChange={onChange} />
      ))
    }
  </div>;
};

const DaysCalendar = ({ viewMonth, viewYear, currentDate, onChange, onMonthClick, onYearClick, weekSelect }) => {
  const weeks = getWeeksInMonth(currentDate, viewYear, viewMonth);
  const viewDate = dateFromMonth(viewYear, viewMonth);

  return (
    <div className={styles.daysCalendar}>
      <div className={styles.headings}>
        <a href='javascript:void(0);' onClick={onMonthClick} >{format(viewDate, 'MMM')}</a>
        <a href='javascript:void(0);' onClick={onYearClick} >{format(viewDate, 'yyyy')}</a>
      </div>
      <div className={styles.daysHeaders} >
        {WEEKDAYS_ABBR.map(day => <span key={day} className={styles.dayHeader}>{day}</span>)}
      </div>
      <div className={`${styles.days} ${weekSelect ? styles.weekSelect : ''}`}>
        {
          map(weeks, (week, weekIndex) => (
            <WeekRow key={weekIndex} week={week} weekIndex={weekIndex} onChange={onChange} />
          ))
        }
      </div>
    </div>
  );
};

export default DaysCalendar;
