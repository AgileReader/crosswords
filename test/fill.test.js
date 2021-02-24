const fs = require('fs');
const crossword = require('./../src/crossword');

test('fill', () => {
  let dataFilenames = [
    'error-1x3.txt',
    'error-3x3.txt',
    'error-cross-3x3.txt',

    'success-1x3.txt',
    'success-3x3.txt',
    'success-4x10.txt',
    'success-10x10.txt',
    'cross-3x3.txt',
    'success-outline-4x5.txt',
    'success-checkboard-5x5.txt',
    'nawrot-cross-3x3.txt',
    'success-ladder-3x9.txt',
  ];

  dataFilenames.map(item => {
    // console.log(item);
    let inputFile = fs.readFileSync('./test/crosswords/fill/' + item).toString();
    let chunks = inputFile.trim().split(RegExp('^---.*?$', 'gms'));


    let inputCrossword = chunks[1].trim();
    let listOfWords = chunks[2].trim().split("\n");
    let expectedResult = Boolean(parseInt(chunks[3].trim()));
    let expectedCrossword = chunks[4].trim();

    let parsedCrossword = crossword.parse(inputCrossword);
    crossword.findHV(parsedCrossword);

    let toFill = crossword.getAllToFill(parsedCrossword);
    listOfWords = crossword.wordsByLength(listOfWords);

    let receivedResult = crossword.fill(parsedCrossword, toFill,listOfWords, 0);

    let receivedBooleanReslut = true;
    if (receivedResult === false) {
      receivedBooleanReslut = false;
    }

    expect(receivedBooleanReslut).toEqual(expectedResult);
    if (expectedResult) {
      expect(crossword.dump(receivedResult)).toEqual(expectedCrossword);
    }
  });
});
