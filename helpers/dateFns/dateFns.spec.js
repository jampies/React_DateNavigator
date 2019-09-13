import assert from 'assert';
import td from 'testdouble';
import { format } from 'date-fns';

describe('date helper', () => {
  let mockDate;
  let getClashingDates, getDayOfWeek, getDatesInWeek, getNextWeek, getEndOfWeek, getStartOfWeek, getCurrentDate;

  beforeEach(() => {
    mockDate = td.replace('./dateWrapper').default;
    td.when(mockDate(), { ignoreExtraArgs: true }).thenReturn(new Date(2018, 7, 21));
    const dateimport = require('./dateFns').default;
    getClashingDates = dateimport.getClashingDates;
    getDayOfWeek = dateimport.getDayOfWeek;
    getDatesInWeek = dateimport.getDatesInWeek;
    getNextWeek = dateimport.getNextWeek;
    getEndOfWeek = dateimport.getEndOfWeek;
    getStartOfWeek = dateimport.getStartOfWeek;
    getCurrentDate = dateimport.getCurrentDate;
  });

  afterEach(() => {
    td.reset();
  });

  describe('getCurrentDate()', () => {
    it('should get current date', () => {
      let date = getCurrentDate();
      assert.equal(format(date, 'yyyy-MM-dd EEE'), '2018-08-21 Tue');
    });
  });

  describe('getStartOfWeek()', () => {
    it('should get monday of week given', () => {
      let date = getStartOfWeek(new Date(2018, 7, 21));
      assert.equal(format(date, 'yyyy-MM-dd EEE'), '2018-08-20 Mon');
    });
  });

  describe('getEndOfWeek()', () => {
    it('should get sunday of week given', () => {
      let date = getEndOfWeek(new Date(2018, 7, 21));
      assert.equal(format(date, 'yyyy-MM-dd EEE'), '2018-08-26 Sun');
    });
  });

  describe('getDayOfWeek', () => {
    it('should return correct day of week if Monday', () => {
      let dayOfWeek = getDayOfWeek(new Date(2018, 7, 20));
      assert.equal(dayOfWeek, 0);
    });

    it('should return correct day of week if Wednesday', () => {
      let dayOfWeek = getDayOfWeek(new Date(2018, 7, 22));
      assert.equal(dayOfWeek, 2);
    });

    it('should return correct day of week if Sunday', () => {
      let dayOfWeek = getDayOfWeek(new Date(2018, 7, 26));
      assert.equal(dayOfWeek, 6);
    });
  });
});
