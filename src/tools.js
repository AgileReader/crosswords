const fs = require('fs');
const stat = require('./stat');

function arrayUnique(a) {
  /**
   * https://codeburst.io/javascript-array-distinct-5edc93501dc4
   */

  return [...new Set(a)];
}

function arrayDiff(a, b) {
  /**
   * https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
   */

  return a.filter(x => !b.includes(x));
}

function arrayIntersection(a, b) {
  /**
   * https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
   */

  return a.filter(x => b.includes(x));
}

function brand(info, ver) {
  return '\nAgile Reader ' + ver + ' / ' + info;
}

function fetchDataOneFile(filename, parser) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (error, fileContents) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        const result = {
          fileContents: fileContents,
          fileName: filename,
        };
        if (parser) {
          result.parsed = parser(fileContents);
        }
        resolve(result);
      }
    });
  });
}

function capitalizeFirstLetters(str) {
  let splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }

  return splitStr.join(' ');
}

function regexpQuote(s) {
  return s
    .toString()
    .replace('?', '\\?')
    .replace('+', '\\+')
    .replace('.', '\\.')
    .replace('*', '\\*')
    .replace('^', '\\^')
    .replace('$', '\\$')
    .replace('[', '\\[')
    .replace(']', '\\]')
    .replace('{', '\\{')
    .replace('}', '\\}')
    .replace('(', '\\(')
    .replace(')', '\\)');
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-/, '')
    .replace(/-$/, '');
}

function findNotUniqueElements(a) {
  let u = stat.arrayToObjCounter(a);

  let result = [];
  const keys = Object.keys(u);
  const numberOfElements = keys.length;
  for (let i = 0; i < numberOfElements; i++) {
    let key = keys[i];
    let value = u[key];
    if (value > 1) {
      result.push(key);
    }
  }

  return result;
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getCurrentFilename() {
  let now = new Date();

  return (
    now.getFullYear() +
    '-' +
    (now.getMonth() + 1) +
    '-' +
    now.getUTCDate() +
    '-' +
    now.getHours() +
    '-' +
    now.getMinutes() +
    '-' +
    now.getSeconds()
  );
}

function clearStringForCrossword(s, isExplanation = false) {
  if (s === '') {
    return {
      word: '',
      xy: '',
    };
  }

  let word = s
    .replace(/\([0-9]+\)/, '')
    .replace(/ +/, ' ')
    .trim();

  if (!isExplanation) {
    return {
      word: word,
      xy: '',
    };
  }

  let chunks = word.split(' ');
  if (chunks.length < 2) {
    return {
      word: chunks[0],
      xy: '',
    };
  }

  let digits = [];
  chunks.map(v => {
    digits.push(v.length);
  });

  return {
    word: chunks.join(''),
    xy: ' (' + digits.join('-') + ')',
  };
}

/**
 * Deep copy obj to obtain new instance.
 *
 * @param obj
 * @returns {any}
 */
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

module.exports = {
  arrayUnique,
  arrayDiff,
  arrayIntersection,
  fetchDataOneFile,
  brand,
  capitalizeFirstLetters,
  regexpQuote,
  slugify,
  findNotUniqueElements,
  shuffle,
  getCurrentFilename,
  clearStringForCrossword,
  deepCopy,
};
