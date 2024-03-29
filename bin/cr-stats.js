#!/usr/bin/env node

require('colors');

const fs = require('fs');
const YAML = require('js-yaml');
const crossword = require('./../src/crossword');
const { brandlib } = require('private-libs');
const { getOneJsonFileParsed } = require('../src/file-tools');

let packageJson = getOneJsonFileParsed('package.json');
console.log(brandlib.brand('Crosswords Clues Stat', packageJson.version).yellow);

generateCrossword();

function generateCrossword() {
  let unknownWordsToMemorize = YAML.load(fs.readFileSync('example-data/crosswords-clues.yaml').toString());

  let wordsForCrossword = unknownWordsToMemorize.map(v => {
    return v.q;
  });

  let listOfWords = crossword.wordsByLength(wordsForCrossword);
  listOfWords.map((v, i) => {
    console.log(i + '   =>   ' + v.length);
  });
}
