const fs = require('fs');
const crossword = require('./../src/crossword');

test('print: body', () => {
  let dataFilenames = [
    'complete-3x3.txt',
  ];

  dataFilenames.map(item => {
    let inputFile = fs.readFileSync('./test/crosswords/print/' + item).toString();
    let chunks = inputFile.trim().split(RegExp('^---.*?$', 'gms'));

    let inputCrossword = JSON.parse(chunks[2].trim());
    let inputWords = JSON.parse(chunks[3].trim());
    let inputCluesDict = JSON.parse(chunks[4].trim());
    let expectedFinalHTMLQ = chunks[5].trim();
    let expectedFinalHTMLA = chunks[6].trim();

    let crosswordToPrint = crossword.toPrint(inputCrossword, inputWords, inputCluesDict);
    let html = crossword.htmlBody(crosswordToPrint, inputCluesDict);

    expect(html.q).toEqual(expectedFinalHTMLQ);
    expect(html.a).toEqual(expectedFinalHTMLA);
  });
});
