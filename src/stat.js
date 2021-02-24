const { aolib } = require('private-libs');

function listWords(p) {
  const pWithSpacesOnly = p.trim().replace(/[^A-Za-zéôæèçêæà]/g, ' ');

  const replacedSpaces = pWithSpacesOnly.replace(/ +/g, ' ').trim().toLowerCase();

  let sorted = replacedSpaces.split(' ').sort();

  return aolib.arrayToObjCounter(sorted);
}

function freqWords(arrayOfWords) {
  const dict = aolib.arrayToObjCounter(arrayOfWords);

  return sortObjectPropertiesFreq(dict);
}

function sortObjectPropertiesWordBooksMeassure(dict, filterArrayFn) {
  const keyValueProcessorFn = (k, v) => {
    return [k, v.length, v];
  };
  const compareFn = (a, b) => {
    if (a[1] == b[1]) {
      if (a[0] > b[0]) {
        return 1;
      } else if (a[0] < b[0]) {
        return -1;
      } else {
        return 0;
      }
    } else {
      return b[1] - a[1];
    }
  };

  const elementProcessorFn = e => {
    return {
      key: e[0],
      value: e[2],
    };
  };

  return aolib.sortObjectProperties(dict, keyValueProcessorFn, compareFn, elementProcessorFn, filterArrayFn);
}

function findWordsCount(freq) {
  let result = 0;

  const keys = Object.keys(freq);
  const numberOfElements = keys.length;
  for (let i = 0; i < numberOfElements; i++) {
    let key = keys[i];
    let value = freq[key];
    result = result + value;
  }

  return result;
}
function sortObjectPropertiesFreq(dict) {
  const keyValueProcessorFn = (k, v) => {
    return [k, v];
  };
  const compareFn = (a, b) => {
    if (a[1] == b[1]) {
      if (a[0] > b[0]) {
        return 1;
      } else if (a[0] < b[0]) {
        return -1;
      } else {
        return 0;
      }
    } else {
      return b[1] - a[1];
    }
  };

  const elementProcessorFn = e => {
    return {
      key: e[0],
      value: e[1],
    };
  };

  return aolib.sortObjectProperties(dict, keyValueProcessorFn, compareFn, elementProcessorFn);
}

module.exports = {
  listWords,
  freqWords,
  sortObjectPropertiesFreq,
  findWordsCount,
  sortObjectPropertiesWordBooksMeassure,
};
