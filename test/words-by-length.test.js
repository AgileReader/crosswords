const crossword = require('./../src/crossword');

test('wordsByLength: first', () => {
  let data = [
    '333',
    'aaa',
    '4444',
    'bbbb',
    '55555',
    'ccccc',
  ];
  let expected = [
    [],
    [],
    [],
    ['333', 'aaa'],
    ['4444', 'bbbb'],
    ['55555', 'ccccc'],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ];

  let received = crossword.wordsByLength(data, );

  expect(received).toEqual(expected);
});

test('wordsByLength: gap', () => {
  let data = [
    '333',
    '999999999',
  ];
  let expected = [
    [],
    [],
    [],
    ['333'],
    [],
    [],
    [],
    [],
    [],
    ['999999999'],
    [],
    [],
    [],
    [],
    [],
    [],
  ];

  let received = crossword.wordsByLength(data, );

  expect(received).toEqual(expected);
});
