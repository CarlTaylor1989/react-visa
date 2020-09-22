import { cleanupText, lib } from '../../lib/htmlutils';

beforeEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test('method decodeHtml()', () => {
  const input = 'irrelevant';
  const output = lib.decodeHtml(input);
  expect(output).toEqual(input);
});

test('method removeMarkup()', () => {
  const input = 'irrelevant';
  const output = lib.removeMarkup(input);
  expect(output).toEqual(input);
});

test('method cleanupText()', () => {
  const input = 'irrelevant';
  lib.decodeHtml = jest.fn(str => str);
  lib.removeMarkup = jest.fn(str => str);
  const output = cleanupText(input);
  expect(output).toEqual(input);
});
