const config = require('../src/configProcessor');

test('updateSize: add size', () => {
  const data = {
    "uniqueWordsCount": 17
  };
  const cfg = [
    {name: 'a', no: 1},
    {name: 'b', no: 10},
    {name: 'c', no: 100},
    {name: 'c', no: 200},
  ];

  expect(config.getBookSize(data, cfg)).toEqual('c');
});
