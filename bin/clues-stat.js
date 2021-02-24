#!/usr/bin/env node

require('colors');

const fs = require('fs');
const YAML = require('js-yaml');
const crossword = require('./../src/crossword');
const { brandlib, datasource, configProcessor } = require('private-libs');

const config = datasource.getConfig();

console.log(brandlib.brand('Crossword', config.config.version).yellow);

generateCrossword();

function generateCrossword() {
  let unknownWordsToMemorize = YAML.load(
    fs.readFileSync(configProcessor.getLibraryPath() + 'output/crosswords-clues.yaml').toString(),
  );

  let wordsForCrossword = unknownWordsToMemorize.map(v => {
    return v.q;
  });

  let listOfWords = crossword.wordsByLength(wordsForCrossword);
  listOfWords.map((v, i) => {
    console.log(i + '   =>   ' + v.length);
  });
}
