const fs = require('fs');
const crossword = require('./../src/crossword');

test('fill', () => {
  let dataFilenames = [
    'filled-success-1x3.txt',
    'filled-success-3x3.txt',
    'filled-success-outline-4x5.txt',

    'cross-3x3.txt',
    'success-1x3.txt',
    'success-3x3.txt',
    'success-4x10.txt',
    'success-10x10.txt',
    'success-checkboard-5x5.txt',
    'success-ladder-3x9.txt',
    'success-outline-4x5.txt',
  ];

  dataFilenames.map(item => {
    // console.log(item);
    let inputFile = fs.readFileSync('./test/crosswords/numbering/' + item).toString();
    let chunks = inputFile.trim().split(RegExp('^---.*?$', 'gms'));


    let inputCrossword = crossword.parse(chunks[1].trim());
    let expectedResultQ = chunks[2].trim();
    let expectedResultA = chunks[3].trim();

    crossword.findHV(inputCrossword);
    crossword.findNumbers(inputCrossword);
    crossword.prepareDataForPrint(inputCrossword);

    // console.log(inputCrossword);

    expect(crossword.dump(inputCrossword, 'N')).toEqual(expectedResultQ);
    expect(crossword.dump(inputCrossword)).toEqual(expectedResultA);
  });
});
