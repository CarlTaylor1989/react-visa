import {
  prepareMapSuspendData,
  prepareScoreData,
  preparePromptsData
} from '../../../tracking/scorm/SuspendData';
import {
  CHALLENGE_PERFECT_STATUS,
  CHALLENGE_COMPLETION_STATUS,
  CHALLENGE_FAILED_STATUS,
  CHALLENGE_IN_PROGRESS_STATUS,
  CHALLENGE_AVAILABLE_STATUS,
  CHALLENGE_UNAVAILABLE_STATUS
} from '../../../config/constants';

describe('method prepareMapSuspendData()', () => {
  test('map data without families', () => {
    const output = prepareMapSuspendData([]);
    expect(output).toEqual({});
  });

  test('challenges containing one perfect and one unavailable challenge', () => {
    const challenges = [{
      id: 'c1',
      familyId: 'm1f1',
      status: CHALLENGE_PERFECT_STATUS
    }, {
      id: 'c2',
      familyId: 'm1f1',
      status: CHALLENGE_UNAVAILABLE_STATUS
    }];
    const output = prepareMapSuspendData(challenges);
    expect(output).toEqual({
      families: expect.arrayContaining([{
        id: expect.any(String),
        perfect: expect.arrayContaining([expect.any(String)]),
        unavailable: expect.arrayContaining([expect.any(String)])
      }])
    });
  });

  test('challenges containing one completed and one available challenge', () => {
    const challenges = [{
      id: 'c1',
      familyId: 'm1f1',
      status: CHALLENGE_COMPLETION_STATUS
    }, {
      id: 'c2',
      familyId: 'm1f1',
      status: CHALLENGE_AVAILABLE_STATUS
    }];
    const output = prepareMapSuspendData(challenges);
    expect(output).toEqual({
      families: expect.arrayContaining([{
        id: expect.any(String),
        completed: expect.arrayContaining([expect.any(String)]),
        available: expect.arrayContaining([expect.any(String)])
      }])
    });
  });

  test('challenges containing one failed and one in progress challenge', () => {
    const challenges = [{
      id: 'c1',
      familyId: 'm1f1',
      status: CHALLENGE_FAILED_STATUS
    }, {
      id: 'c2',
      familyId: 'm1f1',
      status: CHALLENGE_IN_PROGRESS_STATUS
    }];
    const output = prepareMapSuspendData(challenges);
    expect(output).toEqual({
      families: expect.arrayContaining([{
        id: expect.any(String),
        failed: expect.arrayContaining([expect.any(String)]),
        inprogress: expect.arrayContaining([expect.any(String)])
      }])
    });
  });
});

describe('method prepareScoreData()', () => {
  test('score data with scores', () => {
    const scoreData = {
      total: 1000,
      running: 500,
      categories: {
        foo: 1,
        bar: 1
      }
    };
    const output = prepareScoreData(scoreData);
    expect(output).toEqual(scoreData);
  });

  test('score data with no scores', () => {
    const scoreData = {
      total: 1000,
      running: 0,
      categories: {
        foo: 0,
        bar: 0
      }
    };
    const output = prepareScoreData(scoreData);
    expect(output).toEqual({
      total: scoreData.total,
      running: scoreData.running
    });
  });
});

describe('method preparePromptsData()', () => {
  test('returns an empty object', () => {
    const data = {
      achievements: [],
      bonusStreak: 0,
      products: [],
      ranks: []
    };
    const output = preparePromptsData(data);
    expect(output).toEqual({});
  });

  test('returns the prompt data to store', () => {
    const data = {
      achievements: ['ac1'],
      bonusStreak: 1,
      products: ['p1'],
      ranks: ['r1']
    };
    const output = preparePromptsData(data);
    expect(output).toEqual(expect.objectContaining({
      prompts: expect.objectContaining({
        achievements: expect.arrayContaining([expect.any(String)]),
        bonusStreak: expect.any(Number),
        products: expect.arrayContaining([expect.any(String)]),
        ranks: expect.arrayContaining([expect.any(String)])
      })
    }));
  });
});
