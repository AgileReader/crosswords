#!/usr/bin/env node

require('colors');

const fs = require('fs');
const YAML = require('js-yaml');
const tools = require('./../src/tools');
const crossword = require('./../src/crossword');
const datasource = require('./../src/datasource');
const cfg = require('./../src/configProcessor');

const config = datasource.getConfig();

console.log(tools.brand('Crossword', config.config.version).yellow);

generateCrossword();

function generateCrossword() {
  let unknownWordsToMemorize = YAML.load(
    fs.readFileSync(cfg.getLibraryPath() + 'output/crosswords-clues.yaml').toString(),
  );

  let wordsForCrossword = unknownWordsToMemorize.map(v => {
    return v.q;
  });

  let listOfWords = crossword.wordsByLength(wordsForCrossword);
  listOfWords.map((v, i) => {
    console.log(i + '   =>   ' + v.length);
  });
}
