const tools = require('./../src/tools.js');

test('brand: info', () => {
  expect(tools.brand('abc', 'v0.1.0')).toEqual('\nAgile Reader v0.1.0 / abc');
});
