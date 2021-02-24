const fs = require('fs');
const crossword = require('./../src/crossword');

test('print: subroutines', () => {
  let dataFilenames = [
    'subroutines-outline-3x3.txt',
  ];

  dataFilenames.map(item => {
    let inputFile = fs.readFileSync('./test/crosswords/print/' + item).toString();
    let chunks = inputFile.trim().split(RegExp('^---.*?$', 'gms'));

    let inputCrossword = JSON.parse(chunks[2].trim());
    let inputCluesDict = JSON.parse(chunks[3].trim());
    let expectedCrosswordWithouClues = chunks[4].trim();
    let expectedClues = JSON.parse(chunks[5].trim());
    let expectedCrosswordWithClues = chunks[6].trim();
    let expectedToPrint = JSON.parse(chunks[7].trim());
    let expectedHTMLTable = chunks[8].trim();
    let expectedHTMLOlHorizontals = chunks[9].trim();
    let expectedHTMLOlVerticals = chunks[10].trim();

    const receivedClues = crossword.getClues(inputCrossword, inputCluesDict);
    expect(receivedClues).toEqual(expectedClues);

    crossword.clearEntries(inputCrossword);
    expect(crossword.dump(inputCrossword)).toEqual(expectedCrosswordWithouClues);

    crossword.findHV(inputCrossword);
    crossword.findNumbers(inputCrossword);
    crossword.prepareDataForPrint(inputCrossword);

    console.log('*************************************************');
    console.log(inputCrossword);
    crossword.fillClues(inputCrossword, receivedClues);
    expect(crossword.dump(inputCrossword)).toEqual(expectedCrosswordWithClues);

    expect(inputCrossword).toEqual(expectedToPrint);
    //
    // // html table
    // let htmlTable = crossword.htmlTableForCR(inputCrossword);
    // expect(htmlTable).toEqual(expectedHTMLTable);

    // // html ol - horizontals
    // let olHorizontals = crossword.htmlOL(receivedClues, 'horizontal');
    // expect(olHorizontals).toEqual(expectedHTMLOlHorizontals);
    //
    // // html ol - verticals
    // let olVerticals = crossword.htmlOL(receivedClues, 'vertical');
    // expect(olVerticals).toEqual(expectedHTMLOlVerticals);

  });
});
