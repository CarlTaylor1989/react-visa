import ranks, { defaultRank } from '../../config/ranks';
import * as lib from '../../lib/ranks';

test('method getRankId()', () => {
  const output1 = lib.getRankId(-100);
  const output2 = lib.getRankId(0);
  expect(output1).toEqual(defaultRank);
  expect(output2).toEqual(defaultRank);
});

test('function getRankThreshold()', () => {
  const rank = 'r19';
  const threshold = 100000;
  const output = lib.getRankThreshold(rank);
  expect(output).toEqual(threshold);
});

describe('method getRankRange()', () => {
  test('returns an array with just the min value', () => {
    const rank = ranks[0];
    const output = lib.getRankRange(rank.id);
    expect(output).toEqual([rank.threshold]);
  });

  test('returns an array with the min and max values', () => {
    const rankHigh = ranks[0];
    const rankLow = ranks[1];
    const output = lib.getRankRange(rankLow.id);
    expect(output).toEqual([rankLow.threshold, rankHigh.threshold]);
  });
});

describe('method getPercentageComplete()', () => {
  test('rank below max rank returns percentage', () => {
    const rank = ranks[1].id;
    const score = 10750000;
    const output = lib.getPercentageComplete(rank, score);
    expect(output).toEqual(50);
  });

  test('max rank returns 100 percent', () => {
    const rank = ranks[0].id;
    const score = 15000000;
    const output = lib.getPercentageComplete(rank, score);
    expect(output).toEqual(100);
  });
});
