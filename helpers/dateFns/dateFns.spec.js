import assert from 'assert';
import td from 'testdouble';
import { format } from 'date-fns';

describe('date fns', () => {
  let mockDate;
  let getDayOfWeek, getEndOfWeek, getStartOfWeek, getCurrentDate, getWeeksInMonth, dateFromYear, dateFromMonth;

  beforeEach(() => {
    mockDate = td.replace('./dateWrapper').default;
    td.when(mockDate(), { ignoreExtraArgs: true }).thenReturn(new Date(2018, 7, 21));
    const dateimport = require('./dateFns').default;
    getDayOfWeek = dateimport.getDayOfWeek;
    getEndOfWeek = dateimport.getEndOfWeek;
    getStartOfWeek = dateimport.getStartOfWeek;
    getCurrentDate = dateimport.getCurrentDate;
    dateFromYear = dateimport.dateFromYear;
    dateFromMonth = dateimport.dateFromMonth;
    getWeeksInMonth = dateimport.getWeeksInMonth;
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

  describe('dateFromYear', () => {
    it('should return a date object from an int', () => {
      const result = dateFromYear(1999);
      assert.equal(result.getFullYear(), 1999);
    });

    it('should return a date object from a string', () => {
      const result = dateFromYear('1999');
      assert.equal(result.getFullYear(), 1999);
    });
  });

  describe('dateFromMonth', () => {
    it('should return a date object from an int', () => {
      const result = dateFromMonth(1999, 5);
      assert.equal(result.getFullYear(), 1999);
      assert.equal(result.getMonth(), 4);
    });

    it('should return a date object from a string', () => {
      const result = dateFromMonth('1999', '05');
      assert.equal(result.getFullYear(), 1999);
      assert.equal(result.getMonth(), 4);
    });
  });

  describe('getWeeksInMonth', () => {
    it('should return a array of arrays', () => {
      const weeks = getWeeksInMonth(new Date('2018-11-25'), 2018, 11);
      assert.equal(weeks.length, 5);
      assert.equal(weeks[0].length, 7);
      assert.equal(weeks[4].length, 7);
    });

    it('should set the current day as selected', () => {
      const weeks = getWeeksInMonth(new Date('2018-11-25'), 2018, 11);

      assert.equal(weeks[0][6].selected, false);
      assert.equal(weeks[3][5].selected, false);
      assert.equal(weeks[3][6].selected, true);
    });
  });
});
