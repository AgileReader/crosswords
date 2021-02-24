const cr = require('./../src/crossword');

test('cleanString for crossword: empty string', () => {
  str = '';
  expected = {
    word: '',
    xy: '',
  };
  expect(cr.clearStringForCrossword(str)).toEqual(expected);

  str = 'a';
  expected = {
    word: 'a',
    xy: '',
  };
  expect(cr.clearStringForCrossword(str)).toEqual(expected);

  str = 'a';
  expected = {
    word: 'a',
    xy: '',
  };
  expect(cr.clearStringForCrossword(str, true)).toEqual(expected);
});

test('cleanString for crossword: clean (2)', () => {
  str = 'abc (2)';
  expected = {
    word: 'abc',
    xy: '',
  };
  expect(cr.clearStringForCrossword(str)).toEqual(expected);
});

test('cleanString for crossword: (3-3)', () => {
  let str = 'def ghi';
  let expected = {
    word: 'defghi',
    xy: ' (3-3)',
  };
  expect(cr.clearStringForCrossword(str, true)).toEqual(expected);

  str = 'a     b';
  expected = {
    word: 'ab',
    xy: ' (1-1)',
  };
  expect(cr.clearStringForCrossword(str, true)).toEqual(expected);

  str = 'a xy pqr';
  expected = {
    word: 'axypqr',
    xy: ' (1-2-3)',
  };
  expect(cr.clearStringForCrossword(str, true)).toEqual(expected);
});
