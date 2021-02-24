const fs = require('fs');
const crossword = require('./../src/crossword');
const { aolib } = require('private-libs');

test('parse, dump: outline', () => {
  let dataFilenames = [
    'no-1.txt',
  ];

  dataFilenames.map(item => {
    let inputFile = fs.readFileSync('./performance/sun/' + item).toString();
    let chunks = inputFile.trim().split(RegExp('^---.*?$', 'gms'));

    let inputCrossword = chunks[1].trim();
    let parsedCrossword = crossword.parse(inputCrossword);

    let receivedAllWords = crossword.reverse(parsedCrossword);
    receivedAllWords = receivedAllWords.concat(crossword.noise(1000));
    aolib.shuffle(receivedAllWords);
    let listOfWords = crossword.wordsByLength(receivedAllWords);

    let toFill = crossword.getAllToFill(parsedCrossword);

    toFill.sort((a, b) => {
      return b.length - a.length;
    });


    let receivedResult = crossword.fill(parsedCrossword, toFill, listOfWords, 0);
    let dumped = crossword.dump(receivedResult);

    expect(dumped).toEqual(inputCrossword);
  });
});
