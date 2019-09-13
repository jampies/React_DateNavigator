import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';
import td from 'testdouble';
import dateService from '../../helpers/dateFns/dateFns';
import styles from './YearsView.scss';

describe('YearsView', () => {
  let component;
  let fakeOnChange;
  let YearsView;
  let isSelected;

  beforeEach(() => {
    fakeOnChange = td.function('fakeOnChange');
    let fakeDate = td.replace('../../../../helpers/date/date', {
      ...dateService,
      getYear: td.func('getYear')
    });
    td.when(fakeDate.getYear(td.matchers.anything())).thenReturn(2018);
    let YearsViewComponents = require('./YearsView');
    YearsView = YearsViewComponents.default;
    isSelected = YearsViewComponents.isSelected;
    component = mountComponent({});
  });

  function mountComponent ({ currentDate = new Date('2018-08-24') }) {
    return shallow(<YearsView
      currentDate={currentDate}
      onChange={fakeOnChange}
    />);
  }

  it('should render from last year to 4 years in future', () => {
    assert(component.text().includes('2017'));
    assert(component.text().includes('2021'));
    assert(!component.text().includes('2016'));
    assert(!component.text().includes('2022'));
  });

  it('should render current year as selected', () => {
    assert(component.find('button').at(1).hasClass(styles.selected));
  });

  it('should call onChange with correct year when clicking a year', () => {
    component.find('button').at(3).simulate('click');
    td.verify(fakeOnChange(2020));
  });

  it('should return isSelected as true when the year is the current date', () => {
    assert.equal(isSelected(new Date('2012-10-21'), 2012), true);
    assert.equal(isSelected(new Date('2012-10-21'), '2012'), true);
  });

  it('should return isSelected as false when the year is not the current date', () => {
    assert.equal(isSelected(new Date('2012-10-21'), 2011), false);
    assert.equal(isSelected(new Date('2012-10-21'), '2013'), false);
  });
});
