import React from 'react';
import { times, includes } from 'lodash';
import styles from './DaysSelector.scss';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { WEEKDAYS_ABBR } from '../../config/constants';

const CONTEXT = {
  MULTIPLE: 'multiple',
  SINGLE: 'single'
};

function handleKeyPress (event, onChange, index) {
  let keyCode = event.which || event.keyCode;

  if (keyCode === 13) {
    onChange(index);
  }
}

const DaysSelector = ({ selectedIndexes, disabledIndex, onChange, className, context, ...props }) => {
  return (
    <div className={`daysSelector ${styles.daysSelector} ${styles[context]} ${className || ''}`}>
      {props.label && <label className={styles.label}>{props.label}</label>}
      {
        times(WEEKDAYS_ABBR.length, (index) => {
          const disabled = index === disabledIndex;
          const selected = includes(selectedIndexes, index);
          const classNames = classnames(
            'day',
            `day-${index + 1}`,
            styles.day,
            {
              [styles.selectedDay]: selected,
              disabled
            }
          );
          return <div
            className={classNames}
            onClick={() => { !disabled && onChange(index); }}
            key={index}
            onKeyPress={(event) => (!disabled && handleKeyPress(event, onChange, index))}
            tabIndex={0}
            role='checkbox'
            aria-checked={selected}
            aria-disabled={disabled}
            disabled={disabled}
          >
            {WEEKDAYS_ABBR[index]}
          </div>;
        })
      }
    </div>
  );
};

DaysSelector.propTypes = {
  selectedIndexes: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func.isRequired,
  context: PropTypes.oneOf([CONTEXT.SINGLE, CONTEXT.MULTIPLE]).isRequired
};

export default DaysSelector;
