const dataSource = require('../src/datasource');

test('getStoryByTitle: ', () => {
  const indexArray = [
    {storyTitle: 'z', fullFilename: 'w'},
    {storyTitle: 'abc', fullFilename: 'q'},
    {storyTitle: 'z', fullFilename: 'w'}
  ];

  const getIndex = () => {
    return indexArray;
  }

  expect(dataSource.getStoryByTitle('abc', getIndex)).toEqual(indexArray[1]);
  expect(() => dataSource.getStoryByTitle('yyy', getIndex)).toThrow();
  expect(() => dataSource.getStoryByTitle('a', getIndex)).toThrow();
  expect(() => dataSource.getStoryByTitle('', getIndex)).toThrow();
  expect(() => dataSource.getStoryByTitle('z', getindex)).toThrow();
});
