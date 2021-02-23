const tools = require('./../src/tools.js');
const nunjucks = require('nunjucks');
const fs = require('fs');

let combination = 0;
let maxCrossword = null;
let minRemainingToFill = 99999;

/**
 * Parse str to get crossword object.
 *
 * @param str
 * @returns {{a: Array, horizontals: Array, columns: number, rows: number, verticals: Array}}
 */
function parse(str) {
  let rows = str.trim().split(/\n/);
  let numberOfRows = rows.length;

  let firstLineChunks = rows[0].split('|');

  let columnStartIndex = 0;
  if (!firstLineChunks[0]) {
    columnStartIndex = 1;
  }

  let columnEndIndex = firstLineChunks.length;
  if (!firstLineChunks[columnEndIndex - 1]) {
    columnEndIndex = firstLineChunks.length - 1;
  }

  let numberOfColumns = firstLineChunks.length;

  let result = {
    a: [],
    rows: numberOfRows,
    columns: numberOfColumns - columnStartIndex - (firstLineChunks.length - columnEndIndex),
    horizontals: [],
    verticals: [],
  };
  for (let i = 0; i < numberOfRows; i++) {
    result.a.push([]);
    let columns = rows[i].split('|');

    for (let j = columnStartIndex; j < columnEndIndex; j++) {
      result.a[i].push(columns[j].trim());
    }
  }

  return result;
}

/**
 * Dump crossword object as string.
 *
 * Crossword is not modified.
 *
 * @param cr
 * @param type
 * @returns {string}
 */
function dump(cr, type = 'A') {
  let result = '';
  for (let i = 0; i < cr.rows; i++) {
    for (let j = 0; j < cr.columns; j++) {
      if (type === 'N') {
        if (typeof cr.numbers[i][j] === 'number') {
          result = result + cr.numbers[i][j];
        } else {
          result = result + cr.printQ[i][j];
        }
      } else {
        result = result + cr.a[i][j];
      }

      if (j < cr.columns - 1) {
        result = result + ' | ';
      }
    }
    result = result + '\n';
  }

  return result.trim();
}

function generateShape(params) {
  if (params.type === 'template') {
    let fullPath = 'cr-templates/' + params.filename;

    return parse(fs.readFileSync(fullPath).toString());
  }

  if (params.type === 'outline') {
    let result = {
      a: [],
      rows: params.rows,
      columns: params.columns,
      horizontals: [],
      verticals: [],
    };

    for (let i = 0; i < params.rows; i++) {
      result.a.push(outlineRow(params.rows, params.columns, i));
    }

    return result;
  }

  if (params.type === 'ladder') {
    let result = {
      a: [],
      rows: params.rows,
      columns: params.columns,
      horizontals: [],
      verticals: [],
    };

    for (let i = 0; i < params.rows; i++) {
      result.a.push(ladderRow(params.rows, params.columns, i));
    }

    return result;
  }

  if (params.type === 'track') {
    let result = {
      a: [],
      rows: params.rows,
      columns: params.columns,
      horizontals: [],
      verticals: [],
    };

    for (let i = 0; i < params.rows; i++) {
      result.a.push(trackRow(params.rows, params.columns, i));
    }

    return result;
  }

  if (params.type === 'crate') {
    let result = {
      a: [],
      rows: params.rows,
      columns: params.columns,
      horizontals: [],
      verticals: [],
    };

    for (let i = 0; i < params.rows; i++) {
      result.a.push(crateRow(params.rows, params.columns, i));
    }
    return result;
  }

  throw 'generateShape: Incorresc params';
}

function outlineRow(rows, columns, rowNoI) {
  let result = [];
  if (rowNoI === 0 || rowNoI === rows - 1) {
    for (let j = 0; j < columns; j++) {
      result.push('.');
    }
  } else {
    result = ['.'];
    for (let j = 1; j < columns - 1; j++) {
      result.push('■');
    }
    result.push('.');
  }

  return result;
}

function ladderRow(rows, columns, rowNoI) {
  let result = [];

  if (rowNoI % 2 === 0) {
    for (let j = 0; j < columns; j++) {
      result.push('.');
    }
  }

  if (rowNoI % 2 === 1) {
    for (let j = 0; j < columns; j++) {
      if (j % 2 === 0) {
        result.push('.');
      } else {
        result.push('■');
      }
    }
  }

  return result;
}

function trackRow(rows, columns, rowNoI) {
  let result = [];

  if (rowNoI % 2 === 1) {
    for (let j = 0; j < columns; j++) {
      result.push('.');
    }
  }

  if (rowNoI % 2 === 0) {
    for (let j = 0; j < columns; j++) {
      if (j % 2 === 1) {
        result.push('.');
      } else {
        result.push('■');
      }
    }
  }

  return result;
}

function crateRow(rows, columns, rowNoI) {
  let result = [];

  if (rowNoI % 2 === 0) {
    for (let j = 0; j < columns; j++) {
      result.push('.');
    }
  }

  if (rowNoI % 2 === 1) {
    for (let j = 0; j < columns; j++) {
      if (j % 2 === 0) {
        result.push('.');
      } else {
        result.push('■');
      }
    }
  }

  return result;
}

function findHV(cr, withWords = false) {
  if (cr.horizontals.length > 0 || cr.verticals.length > 0) {
    return cr;
  }

  // horizontals
  for (let i = 0; i < cr.rows; i++) {
    let index = 0;
    while (index < cr.columns) {
      // skip ■
      while (index < cr.columns && cr.a[i][index] === '■') {
        index++;
      }

      // consecutive . or letters
      let j = index;
      let word = '';
      while (j < cr.columns && cr.a[i][j] !== '■') {
        word = word + cr.a[i][j];
        j++;
      }

      let length = j - index;

      if (length > 1) {
        let horizontal = {
          x: i,
          y: index,
          length: length,
          word: null,
          type: 'horizontal',
        };
        if (withWords) {
          horizontal.word = word;
        }

        cr.horizontals.push(horizontal);
      }

      index = j;
    }
  }

  // verticals
  for (let i = 0; i < cr.columns; i++) {
    let index = 0;
    while (index < cr.rows) {
      // skip ■
      while (index < cr.rows && cr.a[index][i] === '■') {
        index++;
      }

      // consecutive . or letters
      let j = index;
      let word = '';
      while (j < cr.rows && cr.a[j][i] !== '■') {
        word = word + cr.a[j][i];
        j++;
      }

      let length = j - index;

      if (length > 1) {
        let vertical = {
          x: index,
          y: i,
          length: length,
          word: null,
          type: 'vertical',
        };
        if (withWords) {
          vertical.word = word;
        }

        cr.verticals.push(vertical);
      }

      index = j;
    }
  }

  return cr;
}

/**
 * Insert one element defined by options into cr.
 *
 * Crossword is modified.
 *
 * @param cr
 * @param options
 * @param force
 * @returns {boolean}
 */
function fillOneWord(cr, options, force = false) {
  if (options.word) {
    if (options.type === 'horizontal') {
      for (let i = 0; i < options.word.length; i++) {
        if (!force) {
          if (cr.a[options.x][options.y + i] !== '.' && cr.a[options.x][options.y + i] !== options.word[i]) {
            return false;
          }
        }
        cr.a[options.x][options.y + i] = options.word[i];
      }

      cr.horizontals = cr.horizontals.map(v => {
        if (v.x === options.x && v.y === options.y) {
          v.length = options.word.length;
          v.word = options.word;
        }
        return v;
      });
    }

    if (options.type === 'vertical') {
      for (let i = 0; i < options.word.length; i++) {
        if (!force) {
          if (cr.a[options.x + i][options.y] !== '.' && cr.a[options.x + i][options.y] !== options.word[i]) {
            return false;
          }
        }
        cr.a[options.x + i][options.y] = options.word[i];
      }

      cr.verticals = cr.verticals.map(v => {
        if (v.x === options.x && v.y === options.y) {
          v.length = options.word.length;
          v.word = options.word;
        }
        return v;
      });
    }
  }

  return true;
}

function getAllToFill(cr) {
  let result = [];
  let max = Math.max(cr.horizontals.length, cr.verticals.length);

  for (let i = 0; i < max; i++) {
    if (cr.horizontals[i]) {
      result.push(cr.horizontals[i]);
    }
    if (cr.verticals[i]) {
      result.push(cr.verticals[i]);
    }
  }

  return result;
}

/**
 * Get the deep copy of words except wordToRemove.
 *
 * @param words
 * @param wordToRemove
 * @returns {Array}
 */
function deepCopyWords(words, wordToRemove = null) {
  let result = [];
  for (let i = 0; i < words.length; i++) {
    let tmp = [];
    if (words[i]) {
      for (let j = 0; j < words[i].length; j++) {
        if (wordToRemove !== words[i][j]) {
          tmp.push(words[i][j]);
        }
      }
    }
    result.push(tmp);
  }
  return result;
}

function resetMinMax() {
  maxCrossword = null;
  minRemainingToFill = 99999;
}

function getMaxCrossword() {
  return maxCrossword;
}

/**
 * Fill crossword CR with toFill using words.
 *
 * Level and reset are used for debugging purposes.
 *
 * CR is modified.
 *
 * @param cr
 * @param toFill
 * @param words
 * @param level
 * @param reset
 * @returns {boolean|any|(boolean|any)}
 */
function fill(cr, toFill, words, level = 0, reset = false) {
  if (toFill.length < minRemainingToFill) {
    maxCrossword = tools.deepCopy(cr);
    minRemainingToFill = toFill.length;
  }

  if (reset) {
    combination = 0;
  }
  combination++;
  if (combination % 1000 === 0) {
    console.log('    ------> level = ' + level);
    console.log('    ------> combination = ' + combination);
  }

  let currentElementToFill = toFill[0];
  let currentToFill = Object.create(toFill);
  currentToFill.shift();

  let currentWords = deepCopyWords(words);

  let re = findRegExp(cr, currentElementToFill);
  let matchingWords = findMatchingWords(currentWords, re);

  if (0 === matchingWords.length) {
    return false;
  }

  currentToFill = moveCrossingElementsToFront(currentToFill, currentElementToFill);

  for (let i = 0; i < matchingWords.length; i++) {
    let word = matchingWords[i];

    let currentCr = tools.deepCopy(cr);

    let fillData = {
      word: word,
      type: currentElementToFill.type,
      x: currentElementToFill.x,
      y: currentElementToFill.y,
    };

    /**
     * the word is selected from matching words
     * we can surely insert it
     * there is no need to check the result of insertion
     */
    fillOneWord(currentCr, fillData);

    if (currentToFill.length === 0) {
      return currentCr;
    }

    // get original list of words without current word
    let currentWords = deepCopyWords(words, word);

    // next level of recursion
    let recursiveResult = fill(currentCr, currentToFill, currentWords, level + 1);

    if (false !== recursiveResult) {
      return recursiveResult;
    }
  }

  return false;
}

/**
 * Get the RegExp for one to fill element.
 * Crossword is necessary: it contains info about dots.
 * Crossword is not modified.
 *
 * @param cr
 * @param toFill
 * @returns {string}
 */
function findRegExp(cr, toFill) {
  let regExp = '';

  if (toFill.type === 'horizontal') {
    for (let i = 0; i < toFill.length; i++) {
      regExp = regExp + cr.a[toFill.x][toFill.y + i];
    }
  } else {
    for (let i = 0; i < toFill.length; i++) {
      regExp = regExp + cr.a[toFill.x + i][toFill.y];
    }
  }

  return '^' + regExp + '$';
}

/**
 * Returns the array of words matchin given RegExp.
 * List of words is not modified.
 *
 * Caution: re contains ^ and $
 *
 * @param words
 * @param re
 * @returns {Array}
 */
function findMatchingWords(words, re) {
  let reLength = re.length - 2;
  let result = [];
  if (!words[reLength]) {
    return [];
  }
  for (let i = 0; i < words[reLength].length; i++) {
    if (words[reLength][i].match(re)) {
      result.push(words[reLength][i]);
    }
  }

  return result;
}

function clearEntries(cr, clearHVWords = true) {
  for (let i = 0; i < cr.rows; i++) {
    for (let j = 0; j < cr.columns; j++) {
      if ('■' !== cr.a[i][j]) {
        cr.a[i][j] = '.';
      }
    }
  }
  let allWords = [];
  for (let i = 0; i < cr.horizontals.length; i++) {
    allWords.push(cr.horizontals[i].word);
    if (clearHVWords) {
      cr.horizontals[i].word = null;
    }
  }
  for (let i = 0; i < cr.verticals.length; i++) {
    allWords.push(cr.verticals[i].word);
    if (clearHVWords) {
      cr.verticals[i].word = null;
    }
  }

  return allWords;
}

function reverse(cr, clearHVWords) {
  findHV(cr, true);

  return clearEntries(cr, clearHVWords);
}

function noise(n) {
  let result = [];
  for (let i = 0; i < n; i++) {
    result.push('aa' + i * 100);
  }

  return result;
}

/**
 * Optimize list of words by storing them in array
 * indexed by the length of word.
 *
 * Words param is not modified.
 *
 * @param words
 * @returns {Array[]}
 */
function wordsByLength(words) {
  let result = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
  for (let i = 0; i < words.length; i++) {
    let l = words[i].length;
    if (result[l]) {
      result[l].push(words[i]);
    } else {
      result[l] = [words[i]];
    }
  }

  return result;
}

function getClues(cr, cluesDict) {
  let result = [];
  for (let i = 0; i < cr.horizontals.length; i++) {
    let j = 0;
    for (j = 0; j < cluesDict.length; j++) {
      if (cluesDict[j].q === cr.horizontals[i].word) {
        let x = cr.horizontals[i].x;
        let y = cr.horizontals[i].y;
        let tmpClue = {
          type: 'horizontal',
          x: x,
          y: y,
        };

        tmpClue.length = cluesDict[j].q.length;
        tmpClue.clue = cluesDict[j].a;
        tmpClue.word = cluesDict[j].q;
        tmpClue.number = cr.numbers[x][y];
        result.push(tmpClue);
        break;
      }
    }
    // not found
    if (j == cluesDict.length) {
      let x = cr.horizontals[i].x;
      let y = cr.horizontals[i].y;

      let tmpClue = {
        type: 'horizontal',
        x: cr.horizontals[i].x,
        y: cr.horizontals[i].y,
      };

      tmpClue.length = cr.horizontals[i].length;
      tmpClue.clue = null;
      tmpClue.word = cr.horizontals[i].word;
      tmpClue.number = cr.numbers[x][y];
      result.push(tmpClue);
    }
  }

  for (let i = 0; i < cr.verticals.length; i++) {
    let j = 0;
    for (j = 0; j < cluesDict.length; j++) {
      if (cluesDict[j].q === cr.verticals[i].word) {
        let x = cr.verticals[i].x;
        let y = cr.verticals[i].y;

        let tmpClue = {
          type: 'vertical',
          x: x,
          y: y,
        };

        tmpClue.length = cluesDict[j].q.length;
        tmpClue.clue = cluesDict[j].a;
        tmpClue.word = cluesDict[j].q;
        tmpClue.number = cr.numbers[x][y];

        result.push(tmpClue);
        break;
      }
    }

    // not found
    if (j == cluesDict.length) {
      let x = cr.verticals[i].x;
      let y = cr.verticals[i].y;

      let tmpClue = {
        type: 'vertical',
        x: x,
        y: y,
      };
      tmpClue.length = cr.verticals[i].length;
      tmpClue.clue = null;
      tmpClue.word = cr.verticals[i].word;
      tmpClue.number = cr.numbers[x][y];

      result.push(tmpClue);
    }
  }

  return result;
}

function fillClues(cr, clues) {
  clues.map(v => {
    if (null === v.clue) {
      fillOneWord(cr, v);
    }
  });

  for (let i = 0; i < cr.rows; i++) {
    for (let j = 0; j < cr.columns; j++) {
      if (typeof cr.printQ[i][j] !== 'number') {
        cr.printQ[i][j] = cr.a[i][j];
      }
    }
  }

  return cr;
}

function htmlTableForCR(cr) {
  return nunjucks.render('templates/cr-table.html.tpl', cr).trim();
}

function htmlOL(clues, type) {
  let tmpClues = clues.filter(v => {
    return v.type === type && v.clue;
  });

  return nunjucks.render('templates/cr-ol.html.tpl', { elements: tmpClues }).trim();
}

function htmlBody(inputCrossword, inputCluesDict) {
  nunjucks.configure('', {
    autoescape: false,
  });
  findHV(inputCrossword);
  findNumbers(inputCrossword);
  prepareDataForPrint(inputCrossword);

  let htmlTableA = htmlTableForCR({ data: inputCrossword.printA });

  let crABody = {
    table: htmlTableA,
  };
  let crA = nunjucks.render('templates/cr-a.html.tpl', crABody).trim();

  const receivedClues = getClues(inputCrossword, inputCluesDict);

  clearEntries(inputCrossword);
  fillClues(inputCrossword, receivedClues);

  let htmlTableQ = htmlTableForCR({ data: inputCrossword.printQ });

  let olHorizontals = htmlOL(receivedClues, 'horizontal');
  let olVerticals = htmlOL(receivedClues, 'vertical');

  let bodyData = {
    table: htmlTableQ,
    horizontals: olHorizontals,
    verticals: olVerticals,
  };

  let crQ = nunjucks.render('templates/cr-q.html.tpl', bodyData).trim();

  return {
    q: crQ,
    a: crA,
  };
}

function toPrint(inputCrossword, inputWords) {
  let toFill = getAllToFill(inputCrossword);
  let listOfWords = wordsByLength(inputWords);
  toFill = sortToFillByEn(inputCrossword, toFill);
  return fill(inputCrossword, toFill, listOfWords);
}

function findNumbers(cr) {
  let numbers = [];
  for (let i = 0; i < cr.rows; i++) {
    numbers[i] = [];
    for (let j = 0; j < cr.columns; j++) {
      numbers[i].push('');
    }
  }

  for (let i = 0; i < cr.horizontals.length; i++) {
    let x = cr.horizontals[i].x;
    let y = cr.horizontals[i].y;
    numbers[x][y] = 'N';
  }

  for (let i = 0; i < cr.verticals.length; i++) {
    let x = cr.verticals[i].x;
    let y = cr.verticals[i].y;
    numbers[x][y] = 'N';
  }

  let number = 1;
  for (let i = 0; i < cr.rows; i++) {
    for (let j = 0; j < cr.columns; j++) {
      if (numbers[i][j] === 'N') {
        numbers[i][j] = number;
        number++;
      }
    }
  }

  cr.numbers = numbers;

  for (let i = 0; i < cr.horizontals.length; i++) {
    let x = cr.horizontals[i].x;
    let y = cr.horizontals[i].y;

    cr.horizontals[i].number = cr.numbers[x][y];
  }

  for (let i = 0; i < cr.verticals.length; i++) {
    let x = cr.verticals[i].x;
    let y = cr.verticals[i].y;

    cr.verticals[i].number = cr.numbers[x][y];
  }

  return cr;
}

function prepareDataForPrint(cr, clues = null) {
  cr.printQ = [];
  for (let i = 0; i < cr.rows; i++) {
    cr.printQ[i] = [];
    for (let j = 0; j < cr.columns; j++) {
      if (cr.a[i][j] === '■') {
        cr.printQ[i].push('■');
      } else {
        if (typeof cr.numbers[i][j] == 'number') {
          cr.printQ[i].push(cr.numbers[i][j]);
        } else {
          cr.printQ[i].push('.');
        }
      }
    }
  }

  cr.printA = [];
  for (let i = 0; i < cr.rows; i++) {
    cr.printA[i] = [];
    for (let j = 0; j < cr.columns; j++) {
      cr.printA[i].push(cr.a[i][j]);
    }
  }

  if (clues) {
    for (let i = 0; i < clues.length; i++) {
      let clue = clues[i].q;
      for (let j = 0; j < cr.horizontals.length; j++) {
        if (cr.horizontals[j].word === clue) {
          let x = cr.horizontals[j].x;
          let y = cr.horizontals[j].y;

          clues[i].number = cr.numbers[x][y];
        }
      }

      for (let j = 0; j < cr.verticals.length; j++) {
        if (cr.verticals[j].word === clue) {
          let x = cr.verticals[j].x;
          let y = cr.verticals[j].y;

          clues[i].number = cr.numbers[x][y];
        }
      }
    }
  }
}

function hvIntersect(h, v) {
  return h.y <= v.y && h.y + h.length >= v.y && h.x >= v.x && h.x <= v.x + v.length;
}

function elementsCross(e1, e2) {
  if (e1.type === e2.type) {
    return false;
  }

  if (e1.type === 'horizontal') {
    return hvIntersect(e1, e2);
  } else {
    return hvIntersect(e2, e1);
  }
}

/**
 * Changes toFillElements: moves elements that intersect
 * with toFillElement to the beginning of the list.
 *
 * toFillElements remains unchanged.
 *
 * @param toFillElements
 * @param toFillElement
 * @returns {Array|*[]}
 */
function moveCrossingElementsToFront(toFillElements, toFillElement) {
  if (toFillElements.length === 0) {
    return [];
  }

  let crossing = [];
  let notCrossing = [];
  toFillElements.forEach(v => {
    if (elementsCross(v, toFillElement)) {
      crossing.push(v);
    } else {
      notCrossing.push(v);
    }
  });

  return crossing.concat(notCrossing);
}

function sortToFillByEn(crossword, toFill) {
  // console.log(crossword);
  let crosswordForCrossings = tools.deepCopy(crossword);
  for (let i = 0; i < crosswordForCrossings.rows; i++) {
    for (let j = 0; j < crosswordForCrossings.columns; j++) {
      crosswordForCrossings.a[i][j] = 0;
    }
  }

  for (let i = 0; i < toFill.length; i++) {
    let x = toFill[i].x;
    let y = toFill[i].y;
    for (let j = 0; j < toFill[i].length; j++) {
      if (toFill[i].type == 'horizontal') {
        crosswordForCrossings.a[x][y + j]++;
      }
      if (toFill[i].type === 'vertical') {
        crosswordForCrossings.a[x + j][y]++;
      }
    }
  }

  for (let i = 0; i < toFill.length; i++) {
    toFill[i].enIndex = 0;
    let x = toFill[i].x;
    let y = toFill[i].y;
    for (let j = 0; j < toFill[i].length; j++) {
      if (toFill[i].type == 'horizontal') {
        if (crosswordForCrossings.a[x][y + j] === 2) {
          toFill[i].enIndex++;
        }
      }
      if (toFill[i].type === 'vertical') {
        if (crosswordForCrossings.a[x + j][y] === 2) {
          toFill[i].enIndex++;
        }
      }
    }
  }

  for (let i = 0; i < toFill.length; i++) {
    toFill[i].enIndex = toFill[i].length - toFill[i].enIndex;
  }

  return toFill.sort((a, b) => {
    return a.enIndex - b.enIndex;
  });
}

module.exports = {
  parse,
  dump,
  generateShape,
  fillOneWord,
  findHV,
  fill,
  getAllToFill,
  reverse,
  noise,
  wordsByLength,
  getClues,
  clearEntries,
  fillClues,
  htmlTableForCR,
  htmlOL,
  htmlBody,
  toPrint,
  findNumbers,
  prepareDataForPrint,
  moveCrossingElementsToFront,
  elementsCross,
  resetMinMax,
  getMaxCrossword,
};
