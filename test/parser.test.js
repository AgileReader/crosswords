const fs = require('fs');
const crossword = require('./../src/crossword');

test('parse, dump: typical', () => {
  let dataFilenames = [
    '1x2.txt',
    '2x1.txt',
    '2x5.txt',
    '3x3.txt',
    'large.txt',
  ];

  dataFilenames.map(item => {
    let inputFile = fs.readFileSync('./test/crosswords/parser/' + item).toString();
    let chunks = inputFile.trim().split(RegExp('^---.*?$', 'gms'));

    let inputCrossword = chunks[1].trim();
    let parsedCrossword = crossword.parse(inputCrossword);
    let dumped = crossword.dump(parsedCrossword);

    expect(dumped).toEqual(inputCrossword);
  });
});

test('parse, dump: begin, end bar', () => {
  let dataFilenames = [
    'bar-begin-1x2.txt',
    'bar-end-1x2.txt',
    'bar-begin-end-1x2.txt',
  ];

  dataFilenames.map(item => {
    let inputFile = fs.readFileSync('./test/crosswords/parser/' + item).toString();
    let chunks = inputFile.trim().split(RegExp('^---.*?$', 'gms'));

    let inputCrossword = crossword.parse(chunks[1].trim());
    let outputCrossword = crossword.parse(chunks[2].trim());

    expect(crossword.dump(inputCrossword)).toEqual(crossword.dump(outputCrossword));
  });
});
