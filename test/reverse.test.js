const fs = require('fs');
const crossword = require('./../src/crossword');

test('parse, dump: outline', () => {
  let dataFilenames = [
    'success-outline-3x3.txt',
  ];

  dataFilenames.map(item => {
    let inputFile = fs.readFileSync('./test/crosswords/reverse/' + item).toString();
    let chunks = inputFile.trim().split(RegExp('^---.*?$', 'gms'));

    let inputCrossword = chunks[1].trim();
    let expectedCrossword = chunks[2].trim();
    let expectedHV = JSON.parse(chunks[3].trim());
    let expectedWords = JSON.parse(chunks[4].trim());
    let parsedCrossword = crossword.parse(inputCrossword);

    let receivedAllWords = crossword.reverse(parsedCrossword);
    let dumped = crossword.dump(parsedCrossword);

    let receivedHV = {
      "horizontals": parsedCrossword.horizontals,
      "verticals": parsedCrossword.verticals,
    };

    expect(dumped).toEqual(expectedCrossword);
    expect(receivedHV).toEqual(expectedHV);
    expect(receivedAllWords).toEqual(expectedWords);
  });
});
