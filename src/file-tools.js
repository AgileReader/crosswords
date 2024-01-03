const fs = require('fs');

function getOneJsonFileParsed(filename) {
  return JSON.parse(fs.readFileSync(filename).toString());
}

module.exports = {
  getOneJsonFileParsed,
};
