import assert from 'assert';
import DaysSelector from './DaysSelector';
import React from 'react';
import { shallow } from 'enzyme';
import td from 'testdouble';

describe('DaysSelector', function () {
  let component;
  let fakeOnChange;

  beforeEach(function () {
    fakeOnChange = td.function('fakeOnChange');
    component = mountComponent();
  });

  function mountComponent (label = 'Some label', disabledIndex = undefined) {
    return shallow(<DaysSelector selectedIndexes={[1, 3, 4]} disabledIndex={disabledIndex} onChange={fakeOnChange} label={label} context='single' />);
  }

  afterEach(function () {
    td.reset();
  });

  it('should give correct classnames to selected indexes', function () {
    assert(!component.find('.day').at(0).props().className.includes('selectedDay'));
    assert(component.find('.day').at(1).props().className.includes('selectedDay'));
    assert(component.find('.day').at(3).props().className.includes('selectedDay'));
    assert(component.find('.day').at(4).props().className.includes('selectedDay'));
  });

  it('should call onChange when clicking on an unselected day', function () {
    component.find('.day').at(2).simulate('click');
    td.verify(fakeOnChange(2));
  });

  it('should call onChange when clicking on a selected day', function () {
    component.find('.day').at(3).simulate('click');
    td.verify(fakeOnChange(3));
  });

  it('should render label if label exists', function () {
    component = mountComponent();
    assert(component.text().includes('Some label'));
  });

  it('should select item on enter', function () {
    component.find('.day').at(3).simulate('keypress', { which: 13 });
    component.find('.day').at(3).simulate('keypress', { keyCode: 13 });
    td.verify(fakeOnChange(3), { times: 2 });
  });

  it('should not select item on another keyCode', function () {
    component.find('.day').at(3).simulate('keypress', { which: 14 });
    td.verify(fakeOnChange(3), { times: 0, ignoreExtraArgs: true });
  });

  it('should disable a single item', function () {
    component = mountComponent('Foo', 4);
    assert(component.find('.day').at(4).props().className.includes('disabled'));
    assert(!component.find('.day').at(3).props().className.includes('disabled'));
    component.find('.day').at(3).simulate('click');
    component.find('.day').at(4).simulate('click');
    td.verify(fakeOnChange(4), { times: 0 });
    td.verify(fakeOnChange(3), { times: 1 });
  });
});
