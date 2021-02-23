const fs = require('fs');
const crossword = require('./../src/crossword');

test('generateShape: outline', () => {
  let dataFilenames = [
    'outline-3x3.txt',
    'outline-4x4.txt',
    'outline-3x4.txt',
    'outline-5x10.txt',

    'ladder-3x9.txt',

    'track-3x9.txt',
  ];

  dataFilenames.map(item => {
    let inputFile = fs.readFileSync('./test/crosswords/generators/' + item).toString();
    let chunks = inputFile.trim().split(RegExp('^---.*?$', 'gms'));

    let type = chunks[1].trim();
    let dimensionX = parseInt(chunks[2].trim());
    let dimensionY = parseInt(chunks[3].trim());
    let expectedCrossword = chunks[4].trim();



    let received = crossword.generateShape({type: type, rows: dimensionX, columns: dimensionY});
    let dumped = crossword.dump(received);

    expect(dumped).toEqual(expectedCrossword);
  });
});
