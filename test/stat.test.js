const stat = require('./../src/stat');

test('listWords: list words in a paragraph', () => {
  const p = 'a b c';
  const result = {a: 1, b: 1, c: 1};
  expect(stat.listWords(p)).toEqual(result);
});

test('listWords: separators', () => {
  const p = 'a b.c,d!e?f"g\'h\ni(j)k[l]m*n;o';
  const result = {
    a: 1,
    b: 1,
    c: 1,
    d: 1,
    e: 1,
    f: 1,
    g: 1,
    h: 1,
    i: 1,
    j: 1,
    k: 1,
    l: 1,
    m: 1,
    n: 1,
    o: 1,
  };
  expect(stat.listWords(p)).toEqual(result);
});

test('listWords: digits', () => {
  const p = '0a1b2c3d4e5f6g7h8i9j0k';
  const result = {
    a: 1,
    b: 1,
    c: 1,
    d: 1,
    e: 1,
    f: 1,
    g: 1,
    h: 1,
    i: 1,
    j: 1,
    k: 1,
  };  expect(stat.listWords(p)).toEqual(result);
});

test('listWords: operators', () => {
  const p = 'a+b-c*d/e=f^g%h@i#j$k&l_m';
  const result = {
    a: 1,
    b: 1,
    c: 1,
    d: 1,
    e: 1,
    f: 1,
    g: 1,
    h: 1,
    i: 1,
    j: 1,
    k: 1,
    l: 1,
    m: 1,
  };  expect(stat.listWords(p)).toEqual(result);
});

test('listWords: trim', () => {
  const p = '   a     b   c  ';
  const result = {
    a: 1,
    b: 1,
    c: 1,
  };  expect(stat.listWords(p)).toEqual(result);
});

test('listWords: multiple separators', () => {
  const p = "...a...b...,,,c!!!???    ''' d '''";
  const result = {
    a: 1,
    b: 1,
    c: 1,
    d: 1,
  };  expect(stat.listWords(p)).toEqual(result);
});

test('listWords: lower case', () => {
  const p = 'A B';
  const result = {
    a: 1,
    b: 1,
  };  expect(stat.listWords(p)).toEqual(result);
});

test('listWords: sorting', () => {
  const p = 'd b a f c e';
  const result = {
    a: 1,
    b: 1,
    c: 1,
    d: 1,
    e: 1,
    f: 1,
  };  expect(stat.listWords(p)).toEqual(result);
});

test('freqWords: empty data', () => {
  const p = [];
  const freq = {};
  expect(stat.freqWords(p)).toEqual(freq);
});

test('freqWords: basic example', () => {
  const p = ['a', 'a', 'a', 'b', 'b', 'c'];
  const freq = {
    a: 3,
    b: 2,
    c: 1,
  };
  expect(stat.freqWords(p)).toEqual(freq);
});

test('freqWords: sorting', () => {
  const p = ['b', 'z', 'c', 'a', 'a', 'a', 'z', 'z', 'z', 'c'];
  const freq = {
    z: 4,
    a: 3,
    c: 2,
    b: 1,

  };
  let result = stat.freqWords(p);

  expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(freq));
});

test('freqWords: constructor', () => {
  const p = ['constructor'];
  const freq = {
    constructor: 1
  };
  let result = stat.freqWords(p);

  expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(freq));
  });

test('arrayToObj: basic test', () => {
  const data = ['a', 'b'];

  const expected = {
    a: 1,
    b: 1,
  };

  let result = stat.arrayToObjCounter(data);

  expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(expected));
});

test('arrayToObj: count duplicates', () => {
  const data = ['a', 'b', 'a'];

  const expected = {
    a: 2,
    b: 1,
  };

  let result = stat.arrayToObjCounter(data);

  expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(expected));
});

test('findWordsCount: basic test', () => {
  const data = {
    a: 5,
    b: 4,
    c: 3,
  };

  expect(stat.findWordsCount(data)).toBe(12);
});
