import * as helper from '../../lib/tutorial';
import {
  networkMapPath,
  networkProductPath,
  clientsSelectorPath,
  proposalPath
} from '../../config/navigation';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('function lib.findTutorialId()', () => {
  test('returns the tutorial ID for the network map page', () => {
    const output = helper.lib.findTutorialId(networkMapPath);
    expect(output).toEqual('t4');
  });

  test('returns the tutorial ID for the product page', () => {
    const output = helper.lib.findTutorialId(networkProductPath);
    expect(output).toEqual('t4');
  });

  test('returns the tutorial ID for the client selector page', () => {
    const output = helper.lib.findTutorialId(clientsSelectorPath);
    expect(output).toEqual('t3');
  });

  test('returns the tutorial ID for the client proposal page', () => {
    const output = helper.lib.findTutorialId(proposalPath);
    expect(output).toEqual('t3');
  });

  test('returns the default tutorial ID', () => {
    const output = helper.lib.findTutorialId('irrelevant');
    expect(output).toEqual('t1');
  });
});

describe('function lib.getTutorialSlideIndex()', () => {
  test('tutorial ID not found', () => {
    const output = helper.lib.getTutorialSlideIndex('irrelevant');
    expect(output).toEqual(0);
  });

  test('returns the slide index of tutorial t2', () => {
    const output = helper.lib.getTutorialSlideIndex('t2');
    expect(output).toEqual(3);
  });
});

test('function getLocationTutorialSlideIndex()', () => {
  // setup
  helper.lib.findTutorialId = jest.fn().mockReturnValue('irrelevant');
  helper.lib.getTutorialSlideIndex = jest.fn().mockReturnValue(2);

  // function under test
  const output = helper.getLocationTutorialSlideIndex('irrelevant');

  // expectation
  expect(output).toEqual(expect.any(Number));
});
