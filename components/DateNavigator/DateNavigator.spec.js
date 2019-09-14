import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';
import { DATE_NAVIGATOR_VIEWS } from '../../config/constants';
import td from 'testdouble';
import styles from './DateNavigator.scss';
import DaysSelector from '../DaysSelector/DaysSelector';
import DaysView from '../DaysView/DaysView';
import MonthsView from '../MonthsView/MonthsView';
import YearsView from '../YearsView/YearsView';
import dateService from '../../helpers/dateFns/dateFns';
const { isSameDay } = dateService;

describe('DateNavigator', () => {
  let component;
  let fakeOnChange;
  let defaultCurrentDate;
  let DateNavigator;
  let CalendarBody;
  let Arrow;
  let DIRECTION;
  let DateNavigatorComponents;

  beforeEach(() => {
    fakeOnChange = td.function('fakeOnChange');
    defaultCurrentDate = new Date('2018-08-24');
    let fakeDate = td.replace('../../helpers/dateFns/dateFns', {
      ...dateService,
      getCurrentDate: td.func('getCurrentDate'),
      getMinimumDate: td.func('getMinimumDate'),
      getMaximumDate: td.func('getMaximumDate')
    });
    td.when(fakeDate.getCurrentDate()).thenDo(() => new Date('2018-08-24'));
    td.when(fakeDate.getMinimumDate()).thenDo(() => new Date('2017-01-01'));
    td.when(fakeDate.getMaximumDate()).thenDo(() => new Date('2021-12-31'));
    DateNavigatorComponents = require('./DateNavigator');
    DateNavigator = DateNavigatorComponents.DateNavigator;
    CalendarBody = DateNavigatorComponents.CalendarBody;
    Arrow = DateNavigatorComponents.Arrow;
    DIRECTION = DateNavigatorComponents.DIRECTION;
    component = mountComponent({});
  });

  function mountComponent ({ currentDate = defaultCurrentDate }) {
    return shallow(
      <DateNavigator
        date={currentDate}
        onChange={fakeOnChange}
      />);
  }

  it('should set current date and draft date to today if date not given', () => {
    component = mountComponent({ currentDate: null });
    td.verify(fakeOnChange(td.matchers.argThat(date => isSameDay(date, new Date('2018-08-24')))));
  });

  it('should not render anything in CalendarBody when view is closed', () => {
    component.setState({
      view: DATE_NAVIGATOR_VIEWS.CLOSED
    });
    assert.equal(component.find(CalendarBody).html(), '');
  });

  it('should set view to DAY when clicking header while CLOSED', () => {
    component.find(`.${styles.dateHeader}`).simulate('click');
    assert.deepEqual(component.state().view, DATE_NAVIGATOR_VIEWS.DAY);
  });

  it('should set view to CLOSED when clicking header while open', () => {
    component.setState({
      view: DATE_NAVIGATOR_VIEWS.MONTH
    });
    component.find(`.${styles.dateHeader}`).simulate('click');
    assert.deepEqual(component.state().view, DATE_NAVIGATOR_VIEWS.CLOSED);
  });

  it('should render correct date', () => {
    assert(component.text().includes('24 Aug 2018'));
  });

  it('should change current date when changing DaySelector', () => {
    component.find(DaysSelector).props().onChange(2);
    td.verify(fakeOnChange(td.matchers.anything(date => isSameDay(date, new Date('2018-08-22')))));
  });

  describe('Arrows', () => {
    it('should render double arrows in CLOSED view', () => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.CLOSED
      });
      assert.equal(component.find('Arrow[direction=-1]').length, 2);
      assert.equal(component.find('Arrow[direction=1]').length, 2);
    });

    it('should render single arrow in MONTH view', () => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.MONTH
      });
      assert.equal(component.find('Arrow[direction=-1]').length, 1);
      assert.equal(component.find('Arrow[direction=1]').length, 1);
    });

    it('should render single arrow in DAY view', () => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.DAY
      });
      assert.equal(component.find('Arrow[direction=-1]').length, 1);
      assert.equal(component.find('Arrow[direction=1]').length, 1);
    });

    it('should render no arrows in YEAR view', () => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.YEAR
      });
      assert.equal(component.find('Arrow[direction=-1]').length, 0);
      assert.equal(component.find('Arrow[direction=1]').length, 0);
    });

    it('should call correct arrow function and date when clicking left arrow in CLOSED view', () => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.CLOSED
      });
      component.find(`.${styles.navigatorArrowsContainer}`).at(0).simulate('click');
      td.verify(fakeOnChange(td.matchers.argThat(date => isSameDay(date, new Date('2018-08-17')))));
    });

    it('should call correct arrow function and date when clicking right arrow in CLOSED view', () => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.CLOSED
      });
      component.find(`.${styles.navigatorArrowsContainer}`).at(1).simulate('click');
      td.verify(fakeOnChange(td.matchers.argThat(date => isSameDay(date, new Date('2018-08-31')))));
    });

    it('should call correct arrow function and date when clicking left arrow in DAY view', () => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.DAY
      });
      component.find(`.${styles.navigatorArrowsContainer}`).at(0).simulate('click');
      assert.equal(component.state().viewYear, 2018);
      assert.equal(component.state().viewMonth, 7);
    });

    it('should call correct arrow function and date when clicking right arrow in DAY view', () => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.DAY
      });
      component.find(`.${styles.navigatorArrowsContainer}`).at(1).simulate('click');
      assert.equal(component.state().viewYear, 2018);
      assert.equal(component.state().viewMonth, 9);
    });

    it('should call correct arrow function and date when clicking left arrow in MONTH view', () => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.MONTH
      });
      component.find(`.${styles.navigatorArrowsContainer}`).at(0).simulate('click');
      assert.equal(component.state().viewYear, 2017);
      assert.equal(component.state().viewMonth, 8);
    });

    it('should call correct arrow function and date when clicking right arrow in MONTH view', () => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.MONTH
      });
      component.find(`.${styles.navigatorArrowsContainer}`).at(1).simulate('click');
      assert.equal(component.state().viewYear, 2019);
      assert.equal(component.state().viewMonth, 8);
    });

    it('should render correct class on left arrow', () => {
      component = shallow(<Arrow direction={DIRECTION.BACK} />);
      assert(component.hasClass('navigatorArrowsLeft'));
    });

    it('should render correct class on right arrow', () => {
      component = shallow(<Arrow direction={DIRECTION.FORWARD} />);
      assert(component.hasClass('navigatorArrowsRight'));
    });
  });

  describe('DaysView', () => {
    beforeEach(() => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.DAY
      });
    });

    it('should render DaysView when in DAYS view', () => {
      assert(component.find(CalendarBody).dive().find(DaysView).exists());
      assert(!component.find(CalendarBody).dive().find(MonthsView).exists());
      assert(!component.find(CalendarBody).dive().find(YearsView).exists());
    });

    it('should change current date onChange in DaysView', () => {
      let date = new Date('2019-08-24');
      component.find(CalendarBody).dive().find(DaysView).props().onChange(date);
      td.verify(fakeOnChange(dateService.startOfDay(date)));
    });

    it('should change view to MONTH when clicking month in DaysView', () => {
      component.find(CalendarBody).dive().find(DaysView).props().onMonthClick();
      assert.equal(component.state().view, DATE_NAVIGATOR_VIEWS.MONTH);
    });

    it('should change view to YEAR when clicking year in DaysView', () => {
      component.find(CalendarBody).dive().find(DaysView).props().onYearClick();
      assert.equal(component.state().view, DATE_NAVIGATOR_VIEWS.YEAR);
    });
  });

  describe('MonthsView', () => {
    beforeEach(() => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.MONTH
      });
    });

    it('should render MonthsView when in MONTHS view', () => {
      assert(!component.find(CalendarBody).dive().find(DaysView).exists());
      assert(component.find(CalendarBody).dive().find(MonthsView).exists());
      assert(!component.find(CalendarBody).dive().find(YearsView).exists());
    });

    it('should change draft date when changing months in MonthsView', () => {
      component.find(CalendarBody).dive().find(MonthsView).props().onChange(2);
      assert.equal(component.state().viewMonth, 3);
    });

    it('should change view to YEAR when clicking year in MonthsView', () => {
      component.find(CalendarBody).dive().find(MonthsView).props().onYearClick();
      assert.equal(component.state().view, DATE_NAVIGATOR_VIEWS.YEAR);
    });
  });

  describe('YearsView', () => {
    beforeEach(() => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.YEAR
      });
    });

    it('should render YearsView when in YEARS view', () => {
      assert(!component.find(CalendarBody).dive().find(DaysView).exists());
      assert(!component.find(CalendarBody).dive().find(MonthsView).exists());
      assert(component.find(CalendarBody).dive().find(YearsView).exists());
    });

    it('should change view when changing year in YearsView', () => {
      component.find(CalendarBody).dive().find(YearsView).props().onChange(2020);
      assert.equal(component.state().viewMonth, 8);
      assert.equal(component.state().viewYear, 2020);
      assert.equal(component.state().view, DATE_NAVIGATOR_VIEWS.MONTH);
    });
  });

  describe('validation', () => {
    it('should change date to current date when date is out of bounds', () => {
      component = mountComponent({ currentDate: new Date('2014-06-12') });
      td.verify(fakeOnChange(td.matchers.argThat(date => isSameDay(date, new Date('2018-08-24')))));
    });

    it('should render disabled on left arrow when in MONTH view in 2017', () => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.MONTH,
        viewYear: 2017,
        viewMonth: 5
      });
      assert(component.find(`.${styles.navigatorArrowsContainer}`).at(0).prop('disabled'));
    });

    it('should render disabled on left arrow when in DAY view in JAN 2017', () => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.DAY,
        viewYear: 2017,
        viewMonth: 1
      });
      assert(component.find(`.${styles.navigatorArrowsContainer}`).at(0).prop('disabled'));
    });

    it('should render disabled on left arrow when in CLOSED view in first week of JAN 2017', () => {
      component = mountComponent({ currentDate: new Date('2017-01-03') });
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.CLOSED,
        viewYear: 2017,
        viewMonth: 1
      });
      assert(component.find(`.${styles.navigatorArrowsContainer}`).at(0).prop('disabled'));
    });

    it('should not render disabled on left arrow when in CLOSED view in second week of JAN 2017', () => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.CLOSED,
        viewMonth: 1,
        viewYear: 2017
      });
      assert(!component.find(`.${styles.navigatorArrowsContainer}`).at(0).prop('disabled'));
    });

    it('should render disabled on right arrow when in MONTH view in 2021', () => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.MONTH,
        viewYear: 2021,
        viewMonth: 6
      });
      assert(component.find(`.${styles.navigatorArrowsContainer}`).at(1).prop('disabled'));
    });

    it('should render disabled on right arrow when in DAY view in DEC 2021', () => {
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.DAY,
        viewYear: 2021,
        viewMonth: 12
      });
      assert(component.find(`.${styles.navigatorArrowsContainer}`).at(1).prop('disabled'));
    });

    it('should render disabled on right arrow when in CLOSED view in last week of DEC 2021', () => {
      component = mountComponent({ currentDate: new Date('2021-12-28') });
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.CLOSED
      });
      assert(component.find(`.${styles.navigatorArrowsContainer}`).at(1).prop('disabled'));
    });

    it('should not render disabled on right arrow when in CLOSED view in second last week of DEC 2021', () => {
      component = mountComponent({ currentDate: new Date('2021-12-22') });
      component.setState({
        view: DATE_NAVIGATOR_VIEWS.CLOSED
      });
      assert(!component.find(`.${styles.navigatorArrowsContainer}`).at(1).prop('disabled'));
    });
  });
});
