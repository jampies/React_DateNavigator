import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';
import td from 'testdouble';
import styles from './MonthsView.scss';
import dateService from '../../helpers/dateFns/dateFns';

describe('MonthsView', () => {
  let component;
  let fakeOnChange;
  let MonthsView;
  let isSelected;

  beforeEach(() => {
    fakeOnChange = td.function('fakeOnChange');
    let fakeDate = td.replace('../../../../helpers/date/date', {
      ...dateService,
      getCurrentDate: td.func('getCurrentDate')
    });
    td.when(fakeDate.getCurrentDate()).thenDo(() => new Date('2018-08-24'));
    let MonthsViewComponents = require('./MonthsView');
    MonthsView = MonthsViewComponents.default;
    isSelected = MonthsViewComponents.isSelected;
    component = mountComponent({ });
  });

  function mountComponent ({ currentDate = new Date('2018-08-24'), viewYear = 2018, ...rest }) {
    return shallow(
      <MonthsView
        currentDate={currentDate}
        viewYear={viewYear}
        onChange={fakeOnChange}
        {...rest}
      />);
  }

  it('should render every month of the year', () => {
    assert(component.html().includes('JAN'));
    assert(component.html().includes('JUN'));
    assert(component.html().includes('DEC'));
  });

  it('should render correct year', () => {
    assert(component.html().includes('2018'));
  });

  it('should render current month as selected', () => {
    assert(component.find(`.${styles.month}`).at(7).hasClass('selected'));
  });

  it('should render nothing as selected when not in current year', () => {
    component = mountComponent({ viewYear: 2017 });
    assert(!component.find(`.${styles.selected}`).exists());
  });

  it('should call onChange with correct month when clicking on a month', () => {
    component.find(`.${styles.month}`).at(2).simulate('click');
    td.verify(fakeOnChange(2));
  });

  it('should return isSelected as true when the year and month is the current date', () => {
    assert.equal(isSelected(new Date('2012-10-21'), 2012, 10), true);
  });

  it('should return isSelected as false when the year is not the current date', () => {
    assert.equal(isSelected(new Date('2012-10-21'), 2011, 10), false);
  });

  it('should return isSelected as false when the month is not the current date', () => {
    assert.equal(isSelected(new Date('2012-10-21'), 2012, 11), false);
  });
});
