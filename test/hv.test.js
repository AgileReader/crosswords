const fs = require('fs');
const crossword = require('./../src/crossword');

test('findHV', () => {
  let dataFilenames = [
    '1x3.txt',
    '1x10-two-words.txt',
    '3x1.txt',

    '3x3.txt',
    'cross.txt',
  ];

  dataFilenames.map(item => {
    let inputFile = fs.readFileSync('./test/crosswords/hv/' + item).toString();
    let chunks = inputFile.trim().split(RegExp('^---.*?$', 'gms'));

    let inputCrossword = chunks[1].trim();
    let expectedHV = JSON.parse(chunks[2].trim());

    let parsedCrossword = crossword.parse(inputCrossword);

    crossword.findHV(parsedCrossword);
    let received = {
      horizontals: parsedCrossword.horizontals,
      verticals: parsedCrossword.verticals,
    };

    expect(received).toEqual(expectedHV);
  });
});
