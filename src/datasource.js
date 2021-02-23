const fs = require('fs');
const YAML = require('js-yaml');
const cfg = require('./configProcessor');

const iterationsFileName = cfg.getLibraryPath() + 'output/iterations.yaml';

function getOneJsonFileParsed(filename) {
  return JSON.parse(fs.readFileSync(filename).toString());
}

function getOneYamlFileParsed(filename) {
  try {
    return YAML.load(fs.readFileSync(filename).toString());
  } catch (err) {
    return [];
  }
}

function getStoryByTitle(title, indexSourceFn = getIndex) {
  const stories = getAllStoriesByTitle(title, indexSourceFn);

  if (stories.length > 1) {
    throw 'Duplicated title : ' + title;
  }

  return stories[0];
}

function getAllStoriesByTitle(title, indexSourceFn = getIndex) {
  if (title === '') {
    throw 'Title cannot be empty!';
  }

  let index = indexSourceFn();

  let numberOfStories = 0;
  let found = [];
  for (let i = 0; i < index.length; i++) {
    if (index[i].storyTitle === title) {
      found.push(index[i]);
      numberOfStories++;
    }
  }

  if (numberOfStories === 0) {
    throw 'Title not found: ' + title;
  }

  return found;
}

function getMaskedBook(title) {
  let story = getStoryByTitle(title);

  let filename = cfg.getLibraryPath() + 'output/masked/' + story.fullFilename;
  return JSON.parse(fs.readFileSync(filename).toString());
}

function getIndex(filename = 'output/00index.json') {
  let f = cfg.getLibraryPath() + filename;
  return getOneJsonFileParsed(f);
}

function getCorpus(filename = 'output/corpus.json') {
  let f = cfg.getLibraryPath() + filename;
  return getOneJsonFileParsed(f);
}

function getAllIterations() {
  return getOneYamlFileParsed(iterationsFileName);
}

function getIterationData(number = 0) {
  return getAllIterations()[number - 1];
}

function getFirstTitleFromIteration(number = 0) {
  return getIterationData(number).content[0].title;
}

function getFirstFilenameFromIteration(number = 0) {
  return getIterationData(number).content[0].filename + '.json';
}

function getConfig(filename = 'config.json') {
  let f = cfg.getLibraryPath() + filename;
  return JSON.parse(fs.readFileSync(f));
}

function appendIteration(iteration) {
  let allIterations = getAllIterations();
  allIterations.push(iteration);
  fs.writeFileSync(iterationsFileName, YAML.dump(allIterations));
}

function getReadingList(filename = 'output/reading-list.json') {
  let f = cfg.getLibraryPath() + filename;
  return getOneJsonFileParsed(f);
}

function getReadingListSrc(filename = 'reading-list.yaml') {
  let f = cfg.getLibraryPath() + filename;
  return getOneYamlFileParsed(f);
}

function getWordBooksListMeassure(filename = 'output/meassure-word-books.yaml') {
  let f = cfg.getLibraryPath() + filename;
  return getOneYamlFileParsed(f);
}

module.exports = {
  getIndex,
  getStoryByTitle,
  getAllStoriesByTitle,
  getIterationData,
  getFirstTitleFromIteration,
  getFirstFilenameFromIteration,
  getAllIterations,
  getCorpus,
  getConfig,
  appendIteration,
  getReadingList,
  getMaskedBook,
  getWordBooksListMeassure,
  getReadingListSrc,
};
