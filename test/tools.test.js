const tools = require('./../src/tools.js');

test('arrayUnique: empty array', () => {
  expect(tools.arrayUnique([])).toEqual([]);
});

test('arrayUnique: array with unique elements', () => {
  expect(tools.arrayUnique(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
});

test('arrayUnique: array with not unique elements', () => {
  expect(tools.arrayUnique(['a', 'b', 'a', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c']);
});

test('arrayDiff: a, b empty', () => {
  expect(tools.arrayDiff([], [])).toEqual([]);
});

test('arrayDiff: a empty', () => {
  expect(tools.arrayDiff([], ['a'])).toEqual([]);
});

test('arrayDiff: b empty', () => {
  expect(tools.arrayDiff(['a', 'b', 'c'], [])).toEqual(['a', 'b', 'c']);
});

test('arrayDiff: abc - bc', () => {
  expect(tools.arrayDiff(['a', 'b', 'c'], ['b', 'c'])).toEqual(['a']);
});

test('arrayIntersection: a, b empty', () => {
  expect(tools.arrayIntersection([], [])).toEqual([]);
});

test('arrayIntersection: a empty', () => {
  expect(tools.arrayIntersection([], ['a', 'b', 'c'])).toEqual([]);
});

test('arrayIntersection: b empty', () => {
  expect(tools.arrayIntersection(['a', 'b', 'c'], [])).toEqual([]);
});

test('arrayIntersection: abc * cd', () => {
  expect(tools.arrayIntersection(['a', 'b', 'c'], ['c', 'd'])).toEqual(['c']);
});

test('brand: info', () => {
  expect(tools.brand('abc', 'v0.1.0')).toEqual('\nAgile Reader v0.1.0 / abc');
});

test('capitalizeFirstLetters: empty string', () => {
  expect(tools.capitalizeFirstLetters('')).toEqual('');
});

test('capitalizeFirstLetters: one word', () => {
  expect(tools.capitalizeFirstLetters('abc')).toEqual('Abc');
});

test('capitalizeFirstLetters: three words', () => {
  expect(tools.capitalizeFirstLetters('abc def ghi')).toEqual('Abc Def Ghi');
});

test('regexpQuote: ?[], etc.', () => {
  expect(tools.regexpQuote('a?')).toEqual('a\\?');
  expect(tools.regexpQuote('a.')).toEqual('a\\.');
  expect(tools.regexpQuote('a*')).toEqual('a\\*');
  expect(tools.regexpQuote('a+')).toEqual('a\\+');
  expect(tools.regexpQuote('^a')).toEqual('\\^a');
  expect(tools.regexpQuote('a$')).toEqual('a\\$');
  expect(tools.regexpQuote('a[]')).toEqual('a\\[\\]');
  expect(tools.regexpQuote('a{}')).toEqual('a\\{\\}');
  expect(tools.regexpQuote('a()')).toEqual('a\\(\\)');
});

test('regexpQuote: treat input data as string', () => {
  expect(tools.regexpQuote(1234)).toEqual('1234');
});

test('slugify: basic test', () => {
  expect(tools.slugify(' ___ A b. c, d   e\'"f" -- ')).toEqual('a-b-c-d-e-f');
});

test('findNotUniqueElements: basic test', () => {
  expect(tools.findNotUniqueElements(['a', 'b', 'c', 'a'])).toEqual(['a']);
});

test('findNotUniqueElements: unique elements', () => {
  expect(tools.findNotUniqueElements(['a', 'b', 'c'])).toEqual([]);
});

test('cleanString for crossword: empty string', () => {
  str = '';
  expected = {
    word: '',
    xy: '',
  };
  expect(tools.clearStringForCrossword(str)).toEqual(expected);

  str = 'a';
  expected = {
    word: 'a',
    xy: '',
  };
  expect(tools.clearStringForCrossword(str)).toEqual(expected);

  str = 'a';
  expected = {
    word: 'a',
    xy: '',
  };
  expect(tools.clearStringForCrossword(str, true)).toEqual(expected);
});

test('cleanString for crossword: clean (2)', () => {
  str = 'abc (2)';
  expected = {
    word: 'abc',
    xy: '',
  };
  expect(tools.clearStringForCrossword(str)).toEqual(expected);
});

test('cleanString for crossword: (3-3)', () => {
  let str = 'def ghi';
  let expected = {
    word: 'defghi',
    xy: ' (3-3)',
  };
  expect(tools.clearStringForCrossword(str, true)).toEqual(expected);

  str = 'a     b';
  expected = {
    word: 'ab',
    xy: ' (1-1)',
  };
  expect(tools.clearStringForCrossword(str, true)).toEqual(expected);

  str = 'a xy pqr';
  expected = {
    word: 'axypqr',
    xy: ' (1-2-3)',
  };
  expect(tools.clearStringForCrossword(str, true)).toEqual(expected);
});
