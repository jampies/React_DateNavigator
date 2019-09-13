import assert from 'assert';
import React from 'react';
import { mount } from 'enzyme';
import td from 'testdouble';
import styles from './DaysView.scss';
import dateService from '../../helpers/dateFns/dateFns';

describe('DaysView', () => {
  let component;
  let fakeOnChange;
  let DaysView;

  beforeEach(() => {
    fakeOnChange = td.function('fakeOnChange');
    let fakeDate = td.replace('../../../../helpers/date/date', {
      ...dateService,
      getCurrentDate: td.func('getCurrentDate')
    });
    td.when(fakeDate.getCurrentDate()).thenDo(() => new Date('2018-08-24'));
    DaysView = require('./DaysView').default;
    component = mountComponent({ });
  });

  function mountComponent ({ viewYear = 2018, viewMonth = 8, currentDate = new Date('2018-08-24'), ...rest }) {
    return mount(<DaysView
      viewYear={viewYear}
      viewMonth={viewMonth}
      currentDate={currentDate}
      onChange={fakeOnChange}
      {...rest}
    />);
  }

  it('should render all dates in a month', () => {
    assert(component.html().includes('1'));
    assert(component.html().includes('15'));
    assert(component.html().includes('31'));
  });

  it('should render correct headings', () => {
    assert(component.html().includes('15'));
    assert(component.html().includes('31'));
  });

  it('should render 1st date in correct place', () => {
    assert.equal(component.find('WeekRow').at(0).find('Day').at(2).text(), '1');
  });

  it('should call onChange with correct date when clicking on a day', () => {
    component.find('WeekRow').at(2).find('Day').at(3).simulate('click');
    td.verify(fakeOnChange(td.matchers.argThat(date => dateService.isSameDay(date, new Date('2018-08-16')))));
  });

  it('should set currentDate as selected', () => {
    assert(component.find('WeekRow').at(3).find('Day').at(4).find('button').hasClass('selected'));
  });

  it('should set nothing as selected when not in current month', () => {
    component = mountComponent({ viewMonth: 7, viewYear: 2018 });
    assert(!component.find(`.${styles.selected}`).exists());
  });
});
