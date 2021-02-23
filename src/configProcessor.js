const fs = require('fs');

function getLibraryPath() {
  let cfg = JSON.parse(fs.readFileSync('config.json'));

  return cfg.library;
}

function getBookSize(data, config) {
  for (let i = 0; i < config.length; i++) {
    if (data.uniqueWordsCount < config[i].no) {
      return config[i].name;
    }
  }

  return config[config.length - 1].name;
}

module.exports = {
  getLibraryPath,
  getBookSize,
};
