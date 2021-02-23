function listWords(p) {
  const pWithSpacesOnly = p.trim().replace(/[^A-Za-zéôæèçêæà]/g, ' ');

  const replacedSpaces = pWithSpacesOnly.replace(/ +/g, ' ').trim().toLowerCase();

  let sorted = replacedSpaces.split(' ').sort();

  return arrayToObjCounter(sorted);
}

function freqWords(arrayOfWords) {
  const dict = arrayToObjCounter(arrayOfWords);

  return sortObjectPropertiesFreq(dict);
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

  return sortObjectProperties(dict, keyValueProcessorFn, compareFn, elementProcessorFn);
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

  return sortObjectProperties(dict, keyValueProcessorFn, compareFn, elementProcessorFn, filterArrayFn);
}

function arrayToObjCounter(array) {
  return arrayToObj(array, (element, result) => {
    let toReturn = {
      key: element,
    };
    if (typeof result[element] === 'number') {
      toReturn.value = result[element] + 1;
    } else {
      toReturn.value = 1;
    }
    return toReturn;
  });
}

/**
 * Generic conventer.
 *
 * @param array
 * @param elementProcessorFn
 */
function arrayToObj(array, elementProcessorFn) {
  const result = {};
  for (let i = 0; i < array.length; i++) {
    const processed = elementProcessorFn(array[i], result);
    result[processed.key] = processed.value;
  }

  return result;
}

/**
 * Generic converter.
 *
 * @param obj
 * @param keyValueProcessorFn
 * @returns {Array}
 */
function objToArray(obj, keyValueProcessorFn) {
  const result = [];
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let value = obj[key];
    result.push(keyValueProcessorFn(key, value));
  }

  return result;
}

/**
 * Generic converter.
 *
 * @param dict
 * @param keyValueProcessorFn
 * @param compareFn
 * @param elementProcessorFn
 */
function sortObjectProperties(
  dict,
  keyValueProcessorFn,
  compareFn,
  elementProcessorFn,
  filterArrayFn = null,
) {
  const dataToSort = objToArray(dict, keyValueProcessorFn);
  let sorted = dataToSort.sort(compareFn);
  if (filterArrayFn !== null) {
    sorted = sorted.filter(filterArrayFn);
  }
  const result = arrayToObj(sorted, elementProcessorFn);

  return result;
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

module.exports = {
  listWords,
  freqWords,
  sortObjectPropertiesFreq,
  arrayToObjCounter,
  findWordsCount,
  objToArray,
  sortObjectPropertiesWordBooksMeassure,
};
