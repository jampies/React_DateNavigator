import React from 'react';
import styles from './DateNavigator.scss';
import DaysSelector from '../DaysSelector/DaysSelector';
import DaysView from '../DaysView/DaysView';
import MonthsView from '../MonthsView/MonthsView';
import YearsView from '../YearsView/YearsView';
import { noop } from 'lodash';
import classnames from 'classnames';
import dateService from '../../helpers/dateFns/dateFns';
import { DATE_NAVIGATOR_VIEWS } from '../../config/constants';
const { 
  dateFromMonth, 
  addDays, 
  addMonths, 
  addYears, 
  startOfDay, 
  getMinimumDate, 
  getMaximumDate, 
  getNewDate, 
  getCurrentDate, 
  getMonth, 
  getYear, 
  isBetweenDays, 
  addWeeks, 
  format, 
  getDayOfWeek, 
  getStartOfWeek 
} = dateService;

export const DIRECTION = {
  BACK: -1,
  FORWARD: 1
};

const getClosedState = date => ({
  viewMonth: getMonth(date),
  viewYear: getYear(date),
  view: DATE_NAVIGATOR_VIEWS.CLOSED,
  date: date
});

const getTargetState = (view, viewYear, viewMonth) => {
  let stateChanges = {};
  /* istanbul ignore else */
  if (view) {
    stateChanges.view = view;
  }
  if (viewYear) {
    stateChanges.viewYear = viewYear;
  }
  if (viewMonth) {
    stateChanges.viewMonth = viewMonth;
  }
  return stateChanges;
};

export const CalendarBody = ({ date, viewMonth, viewYear, view, selectDate, selectView, weekSelect }) => {
  switch (view) {
    case DATE_NAVIGATOR_VIEWS.DAY:
      return (
        <DaysView
          viewMonth={viewMonth}
          viewYear={viewYear}
          currentDate={date}
          onChange={date => selectDate(date)}
          onMonthClick={() => selectView(DATE_NAVIGATOR_VIEWS.MONTH)}
          onYearClick={() => selectView(DATE_NAVIGATOR_VIEWS.YEAR)}
          tabIndex={-1}
          weekSelect={weekSelect}
        />
      );
    case DATE_NAVIGATOR_VIEWS.MONTH:
      return (
        <MonthsView
          viewYear={viewYear}
          currentDate={date}
          onChange={(newMonth) => selectView(DATE_NAVIGATOR_VIEWS.DAY, null, newMonth + 1)}
          onYearClick={() => selectView(DATE_NAVIGATOR_VIEWS.YEAR)}
        />
      );
    case DATE_NAVIGATOR_VIEWS.YEAR:
      return (
        <YearsView
          currentDate={date}
          onChange={(newYear) => selectView(DATE_NAVIGATOR_VIEWS.MONTH, newYear)}
        />
      );
    default:
      return null;
  }
};

export const Arrow = ({ direction }) => {
  const directionStyle = direction === DIRECTION.BACK ? styles.navigatorArrowsLeft : styles.navigatorArrowsRight;
  return (
    <div className={classnames(styles.navigatorArrow, directionStyle)} />
  );
};

export class DateNavigator extends React.Component {
  constructor (props) {
    super(props);

    this.toggleNavigatorOpen = this.toggleNavigatorOpen.bind(this);
    this.selectDate = this.selectDate.bind(this);
    this.selectView = this.selectView.bind(this);
    this.navigateWeek = this.navigateWeek.bind(this);
    this.navigateView = this.navigateView.bind(this);
    this.isOutOfBounds = this.isOutOfBounds.bind(this);
    this.renderDaySelector = this.renderDaySelector.bind(this);
    this.renderArrowIcons = this.renderArrowIcons.bind(this);
    this.renderArrowButton = this.renderArrowButton.bind(this);
    this.getArrowButtonClickHandler = this.getArrowButtonClickHandler.bind(this);
    this.closeNavigator = this.closeNavigator.bind(this);
    this.setNavigatorRef = this.setNavigatorRef.bind(this);

    this.minDate = props.minimumDate || getMinimumDate();
    this.maxDate = props.maximumDate || getMaximumDate();

    if (!props.date) {
      this.selectDate(startOfDay(getCurrentDate()));
    }

    const date = getNewDate(props.date);
    this.state = getClosedState(date);
  }

  selectView (view, viewYear, viewMonth) {
    this.setState(getTargetState(view, viewYear, viewMonth));
  }

  navigateView (adjustment, unit, dryrun = false) {
    let viewDate = dateFromMonth(this.state.viewYear, this.state.viewMonth);
    switch (unit) {
      case 'months': {
        viewDate = addMonths(viewDate, adjustment);
        break;
      }
      case 'years': {
        viewDate = addYears(viewDate, adjustment);
        break;
      }
      default: {
        viewDate = addDays(viewDate, adjustment);
        break;
      }
    }
    if (dryrun) {
      return viewDate;
    }
    this.setState({
      viewMonth: getMonth(viewDate),
      viewYear: getYear(viewDate)
    });
  }

  navigateWeek (adjustment, dryrun = false) {
    const { date } = this.state;
    let newDate = getNewDate(date);
    newDate = addWeeks(newDate, adjustment);
    if (dryrun) {
      return newDate;
    }
    this.selectDate(newDate);
  }

  selectDate (date) {
    const { onChange } = this.props;
    date = startOfDay(date);
    onChange(date);
    this.setState(getClosedState(date));
  }

  closeNavigator (e) {
    if (!this.state.navigatorRef.contains(e.target)) {
      this.selectView(DATE_NAVIGATOR_VIEWS.CLOSED);
    }
  }

  setNavigatorRef (ref) {
    this.setState({
      navigatorRef: ref
    });
  }

  static getDerivedStateFromProps (props) {
    if (props.date) {
      return {
        date: getNewDate(props.date)
      };
    }
  }

  componentDidMount () {
    document.addEventListener('click', this.closeNavigator, true);
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.closeNavigator, true);
  }

  toggleNavigatorOpen () {
    const { view } = this.state;
    const newView = view === DATE_NAVIGATOR_VIEWS.CLOSED ? DATE_NAVIGATOR_VIEWS.DAY : DATE_NAVIGATOR_VIEWS.CLOSED;
    this.selectView(newView);
  }

  renderDaySelector () {
    const { date } = this.state;
    return (
      <DaysSelector
        className={styles.daysSelector}
        context='single'
        selectedIndexes={[getDayOfWeek(date)]}
        onChange={(day) => this.selectDate(addDays(getStartOfWeek(date), day))}
      />
    );
  }

  getArrowButtonClickHandler (direction) {
    const { view } = this.state;
    switch (view) {
      case DATE_NAVIGATOR_VIEWS.DAY:
        return this.navigateView.bind(this, direction, 'months');
      case DATE_NAVIGATOR_VIEWS.MONTH:
        return this.navigateView.bind(this, direction, 'years');
      case DATE_NAVIGATOR_VIEWS.CLOSED:
        return this.navigateWeek.bind(this, direction);
      default:
        return noop;
    }
  }

  renderArrowIcons (direction) {
    const { view } = this.state;
    switch (view) {
      case DATE_NAVIGATOR_VIEWS.DAY:
      case DATE_NAVIGATOR_VIEWS.MONTH:
        return <Arrow direction={direction} />;
      case DATE_NAVIGATOR_VIEWS.CLOSED:
        return [<Arrow key='1' direction={direction} />, <Arrow key='2' direction={direction} />];
      default:
        return null;
    }
  }

  renderArrowButton (direction) {
    const onClick = this.getArrowButtonClickHandler(direction);
    const isInvalid = this.isOutOfBounds(onClick(true));
    return (
      <button className={styles.navigatorArrowsContainer}
        disabled={isInvalid}
        onClick={() => onClick()}>
        {this.renderArrowIcons(direction)}
      </button>
    );
  }

  isOutOfBounds (date) {
    if (!date) {
      return true;
    }
    return !isBetweenDays(date, this.minDate, this.maxDate);
  }

  render () {
    const { weekSelect } = this.props;
    const { date } = this.state;
    const { viewMonth, viewYear, view } = this.state;

    if (!date) {
      return <span>Loading...</span>;
    }

    if (this.isOutOfBounds(date)) {
      this.selectDate(getCurrentDate());
      return <span>Loading...</span>;
    }

    let isOpen = view !== DATE_NAVIGATOR_VIEWS.CLOSED;

    return (
      <div className={styles.dateNavigatorComponent} ref={this.setNavigatorRef}>
        {this.renderArrowButton(DIRECTION.BACK)}

        <div className={styles.mid}>
          <button
            className={styles.dateHeader}
            onClick={this.toggleNavigatorOpen}
          >
            {date && format(date, 'dd MMM yyyy')}
          </button>

          {!isOpen && this.renderDaySelector()}

          <div className={classnames(styles.dateNavigatorSlideDownContainer, isOpen ? styles.open : styles.closed)}>
            <CalendarBody
              date={date}
              viewMonth={viewMonth}
              viewYear={viewYear}
              view={view}
              selectDate={this.selectDate}
              selectView={this.selectView}
              weekSelect={weekSelect} />
          </div>
        </div>

        {this.renderArrowButton(DIRECTION.FORWARD)}
      </div>
    );
  }
}

export default DateNavigator;
