import React from 'react';
import styles from './YearsView.scss';
import { map } from 'lodash';
import classnames from 'classnames';
import dateService from '../../helpers/dateFns/dateFns';
const { getYear, isSameYear, dateFromYear } = dateService;

export const isSelected = (currentDate, year) => isSameYear(currentDate, dateFromYear(year));

const YearsView = ({ currentDate, onChange }) => {
  let firstYear = getYear(currentDate) - 1;
  let years = [];
  for (let i = 0; i < 5; i++) {
    years.push(firstYear + i);
  }

  return (
    <div className={styles.yearView}>
      <div className={styles.yearsContainer}>
        {map(years, (year) =>
          <button
            className={classnames(styles.year, { [styles.selected]: isSelected(currentDate, year) })}
            key={year}
            onClick={() => onChange(year)}>
            {year}
          </button>)}
      </div>
    </div>
  );
};

export default YearsView;
