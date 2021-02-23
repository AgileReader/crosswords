const fs = require('fs');
const crossword = require('./../src/crossword');

test('parse, dump: outline', () => {
  let dataFilenames = [
    'success-empty-h-abc.txt',
    'success-h-abc.txt',
    'success-v-def.txt',
    'error-v-foo.txt',
    'error-h-foo.txt',
  ];

  dataFilenames.map(item => {
    // console.log(item);
    let inputFile = fs.readFileSync('./test/crosswords/inserts/' + item).toString();
    let chunks = inputFile.trim().split(RegExp('^---.*?$', 'gms'));

    let inputCrossword =  chunks[1].trim();
    let parsedCrossword = crossword.parse(inputCrossword);
    crossword.findHV(parsedCrossword);

    let insertData = JSON.parse(chunks[2].trim());
    let expectedResult = Boolean(parseInt(chunks[3].trim()));
    let expectedCrossword = chunks[4].trim();
    let insertResult = crossword.fillOneWord(parsedCrossword, insertData);

    expect(insertResult).toEqual(expectedResult);

    if (insertResult) {
      let dumped = crossword.dump(parsedCrossword);
      let expectedHorizontals = JSON.parse(chunks[5]);
      let expectedVerticals = JSON.parse(chunks[6]);

      expect(dumped).toEqual(expectedCrossword);
      expect(parsedCrossword.horizontals).toEqual(expectedHorizontals);
      expect(parsedCrossword.verticals).toEqual(expectedVerticals);
    }
  });
});
