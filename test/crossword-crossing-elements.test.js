const fs = require('fs');
const crossword = require('./../src/crossword');

test('elementsCross: two verticals', () => {
  let e1 = {
    'type': 'vertical'
  };

  let e2 = {
    'type': 'vertical'
  };

  expect(crossword.elementsCross(e1, e2)).toBe(false);
});

test('elementsCross: two horizontals', () => {
  let e1 = {
    'type': 'horizontal'
  };

  let e2 = {
    'type': 'horizontal'
  };

  expect(crossword.elementsCross(e1, e2)).toBe(false);
});

test('elementsCross: coordinates are horizontal', () => {
  let e1 = {
    'x': 0,
    'y': 0,
    'length': 4,
    'word': null,
    'type': 'vertical'
  };

  let e2 = {
    'x': 0,
    'y': 0,
    'length': 4,
    'word': null,
    'type': 'horizontal'
  };

  expect(crossword.elementsCross(e1, e2)).toBe(true);
});

test('moveCrossingElementsToFront: empty data', () => {
  expect(crossword.moveCrossingElementsToFront([], null)).toEqual([]);
});

test('moveCrossingElementsToFront: 4x5', () => {
  let dataFilenames = [
    '4x5.txt',
    '4x5-ver-2.txt',
  ];

  dataFilenames.map(item => {
    let inputFile = fs.readFileSync('./test/crosswords/crossing-elements/' + item).toString();
    let chunks = inputFile.trim().split(RegExp('^---.*?$', 'gms'));

    let hvs = JSON.parse(chunks[2].trim());
    let expectedToFill = JSON.parse(chunks[3].trim());

    let currentElementToFill = hvs[0];
    hvs.shift();

    let received = crossword.moveCrossingElementsToFront(hvs, currentElementToFill);

    expect(received).toEqual(expectedToFill);
  });
});


