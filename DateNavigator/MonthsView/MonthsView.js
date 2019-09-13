import React from 'react';
import { map } from 'lodash';
import styles from './MonthsView.scss';
import { dateFromMonth } from '../utils';
import classnames from 'classnames';
import dateService from '../../helpers/dateFns/dateFns';
const { isSameMonth } = dateService;

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const isSelected = (currentDate, viewYear, month) => isSameMonth(currentDate, dateFromMonth(viewYear, month));

const MonthsView = ({ currentDate, viewYear, onChange, onYearClick }) => {
  return (
    <div className={styles.monthView}>
      <div className={styles.headings}>
        <a href='javascript:void(0);' onClick={onYearClick} >{viewYear}</a>
      </div>
      <div className={styles.monthsContainer}>
        {map(MONTHS, (month, index) =>
          <button
            className={classnames(styles.month, { [styles.selected]: isSelected(currentDate, viewYear, index + 1) })}
            key={month}
            onClick={() => onChange(index)}>
            {month}
          </button>)}
      </div>
    </div>
  );
};

export default MonthsView;
