#!/usr/bin/env node

require('colors');

const fs = require('fs');
const YAML = require('js-yaml');
const nunjucks = require('nunjucks');
const { aolib, datelib, brandlib } = require('private-libs');
const crossword = require('./../src/crossword');
const fileTools = require('./../src/file-tools');
const { getOneJsonFileParsed } = require('../src/file-tools');

const NUMBER_OF_CROSSWORDS = 16;
const DEBUG = false;
const VERBOSITY = 1;

if (VERBOSITY > 0) {
  let packageJson = getOneJsonFileParsed('package.json');
  console.log(brandlib.brand('Crosswords Generator', packageJson.version).yellow);
  console.log('');
  console.log('Input data.........................: ' + 'example-data/crosswords-clues.yaml'.green);
  console.log('Crosswords are generated in folder.: ' + 'crosswords/'.green);
}

const predefinedShapes = [
  // {
  //   type: 'outline',
  //   rows: 3,
  //   columns: 5,
  // },
  // {
  //   type: 'template',
  //   filename: 'sun-no-1.txt',
  // },
  // {
  //   type: 'template',
  //   filename: '7x11.txt',
  // },
  // {
  //   type: 'template',
  //   filename: '7x10.txt',
  // },
  // {
  //   type: 'template',
  //   filename: '7x10.txt',
  // },
  {
    type: 'template',
    filename: '9x5.txt',
  },
  {
    type: 'template',
    filename: '7x5.txt',
  },
  {
    type: 'template',
    filename: '8x5.txt',
  },
  {
    type: 'crate',
    rows: 4,
    columns: 7,
  },
  {
    type: 'crate',
    rows: 5,
    columns: 6,
  },
  {
    type: 'crate',
    rows: 4,
    columns: 5,
  },
  {
    type: 'crate',
    rows: 5,
    columns: 5,
  },
  // {
  //   type: 'crate',
  //   rows: 7,
  //   columns: 7,
  // },
  {
    type: 'track',
    rows: 5,
    columns: 9,
  },
  {
    type: 'track',
    rows: 5,
    columns: 7,
  },
  {
    type: 'track',
    rows: 7,
    columns: 7,
  },
  {
    type: 'crate',
    rows: 6,
    columns: 6,
  },
  {
    type: 'crate',
    rows: 5,
    columns: 5,
  },
  {
    type: 'crate',
    rows: 5,
    columns: 5,
  },
  // {
  //   type: 'outline',
  //   rows: 5,
  //   columns: 9,
  // },
];

generateCrossword(predefinedShapes, VERBOSITY);

function generateCrossword(shapes, verbosity = 0) {
  let unknownWordsToMemorize = null;
  if (!DEBUG) {
    unknownWordsToMemorize = YAML.load(fs.readFileSync('example-data/crosswords-clues.yaml').toString());
  } else {
    let corpus = fileTools.getOneJsonFileParsed('example-data/corpus.json');
    unknownWordsToMemorize = aolib.objToArray(corpus, (k, v) => {
      return { q: k, a: v };
    });
  }

  // let unknownWordsToMemorize = YAML.load(fs.readFileSync('output/crosswords-clues.yaml').toString());

  let crosswordsQ = [];
  let crosswordsA = [];

  /*
   * We run the iteration until we have NUMBER_OF_CROSSWORDS filled crosswords.
   */
  for (let i = 0; i < 1000; i++) {
    if (verbosity > 1) {
      console.log('===> ' + (i + 1) + '/' + NUMBER_OF_CROSSWORDS);
    }

    aolib.shuffle(unknownWordsToMemorize);
    let wordsForCrossword = unknownWordsToMemorize.map(v => {
      return v.q;
    });
    const numberOfShapes = shapes.length;
    const shape = shapes[i % numberOfShapes];

    if (verbosity > 2) {
      console.log(JSON.stringify(shape));
    }

    let inputCrossword = crossword.generateShape(shape);
    crossword.findHV(inputCrossword);

    crossword.resetMinMax();
    let html = null;

    /*
     * Debug info about
     *   - level
     *   - combination
     * is printed inside:
     *    .toPrint()
     *    .fill()
     */
    // let filledCrossword = crossword.toPrint(inputCrossword, wordsForCrossword, unknownWordsToMemorize, debug);
    let filledCrossword = crossword.toPrint(inputCrossword, wordsForCrossword, verbosity);

    if (!filledCrossword) {
      console.log('ERROR'.red);
      html = crossword.htmlBody(crossword.getMaxCrossword(), unknownWordsToMemorize);
    } else {
      html = crossword.htmlBody(filledCrossword, unknownWordsToMemorize);
    }

    if (crosswordsA.indexOf(html.a) !== -1) {
      console.log('DUPLICATE'.red);

      continue;
    }

    crosswordsA.push(html.a);
    crosswordsQ.push(html.q);

    if (crosswordsA.length === NUMBER_OF_CROSSWORDS) {
      break;
    }
  }

  let dateAsFilename = datelib.getCurrentFilename();

  let pageQ = nunjucks
    .render('templates/cr-page-n.html.tpl', { items: crosswordsQ, title: dateAsFilename + '-q' })
    .trim();
  let pageA = nunjucks
    .render('templates/cr-page-n.html.tpl', { items: crosswordsA, title: dateAsFilename + '-a' })
    .trim();

  let filename = 'crosswords/' + dateAsFilename;
  fs.writeFileSync(filename + '-q.html', pageQ);
  fs.writeFileSync(filename + '-a.html', pageA);
}
