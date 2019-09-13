import assert from 'assert';
import { dateFromYear, dateFromMonth, getWeeksInMonth } from './utils';

describe('DateNavigator Utilities', () => {
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
