const fs = require('fs');
const crossword = require('./../src/crossword');

test('print: body', () => {
  let dataFilenames = [
    'body-1x3.txt',
  ];

  dataFilenames.map(item => {
    let inputFile = fs.readFileSync('./test/crosswords/print/' + item).toString();
    let chunks = inputFile.trim().split(RegExp('^---.*?$', 'gms'));

    let inputCrossword = JSON.parse(chunks[2].trim());
    let inputCluesDict = JSON.parse(chunks[3].trim());
    let expectedFinalHTML = chunks[4].trim();

    let bodyHtml = crossword.htmlBody(inputCrossword, inputCluesDict);

    expect(bodyHtml.q).toEqual(expectedFinalHTML);
  });
});
