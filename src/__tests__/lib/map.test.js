import _ from 'lodash';
import * as helper from '../../lib/map';
import {
  CHALLENGE_PERFECT_STATUS,
  CHALLENGE_COMPLETION_STATUS,
  CHALLENGE_FAILED_STATUS,
  CHALLENGE_IN_PROGRESS_STATUS,
  CHALLENGE_AVAILABLE_STATUS,
  CHALLENGE_UNAVAILABLE_STATUS,
  CHALLENGE_NOT_STARTED_CLASS,
  CHALLENGE_AVAILABLE_CLASS,
  CHALLENGE_COMPLETED_CLASS,
  CHALLENGE_PERFECT_CLASS,
  FAMILY_COMPLETION_STATUS,
  FAMILY_INCOMPLETE_STATUS,
  XAPI_FAIL_CHALLENGE,
  XAPI_FAIL_CHALLENGE_SCORE,
  XAPI_COMPLETED_CHALLENGE,
  XAPI_COMPLETED_CHALLENGE_SCORE,
  XAPI_PERFECT_CHALLENGE,
  XAPI_PERFECT_CHALLENGE_SCORE
} from '../../config/constants';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('method lib.determineFamilyStatus()', () => {
  test('completed family', () => {
    const output = helper.lib.determineFamilyStatus({ completed: ['foo'] });
    expect(output).toEqual(FAMILY_COMPLETION_STATUS);
  });

  test('incomplete family', () => {
    const output = [
      helper.lib.determineFamilyStatus({ failed: ['foo'] }),
      helper.lib.determineFamilyStatus({ inprogress: ['foo'] }),
      helper.lib.determineFamilyStatus({ available: ['foo'] }),
      helper.lib.determineFamilyStatus({ unavailable: ['foo'] })
    ];

    expect(output.every(val => val === FAMILY_INCOMPLETE_STATUS)).toBeTruthy();
  });
});

describe('method lib.getStoredChallengeStatus()', () => {
  test('data containing perfect, completed and failed challenges', () => {
    const data = {
      id: 'foo',
      perfect: ['c1'],
      completed: ['c2'],
      failed: ['c3'],
    };
    const output = helper.lib.getStoredChallengeStatus(data);
    expect(output[data.id]).toBeDefined();
    expect(_.keysIn(output[data.id]).length).toEqual(3);
  });

  test('data containing in progress, available and unavailable challenges', () => {
    const data = {
      id: 'bar',
      inprogress: ['c4'],
      available: ['c5'],
      unavailable: ['c6'],
    };
    const output = helper.lib.getStoredChallengeStatus(data);
    expect(output[data.id]).toBeDefined();
    expect(_.keysIn(output[data.id]).length).toEqual(3);
  });
});

describe('method getStoredMapData()', () => {
  beforeEach(() => {
    helper.lib.determineFamilyStatus = jest.fn().mockReturnValue(FAMILY_INCOMPLETE_STATUS);
    helper.lib.getStoredChallengeStatus = jest.fn().mockReturnValue({
      foo: {
        bar: CHALLENGE_PERFECT_CLASS
      }
    });
  });

  test('empty suspend data', () => {
    const output = helper.getStoredMapData({});
    expect(output).toEqual({
      families: [],
      challenges: {}
    });
  });

  test('suspend data with family data', () => {
    const data = {
      map: {
        families: [{
          id: 'foo'
        }]
      }
    };
    const output = helper.getStoredMapData(data);
    expect(output).toEqual({
      families: expect.arrayContaining([expect.any(Object)]),
      challenges: expect.any(Object)
    });
  });
});

describe('method getStoredChallengeStatus()', () => {
  test('returns the stored status', () => {
    // setup
    const familyId = 'm1f2';
    const challengeId = 'c2';
    const challenges = {
      [familyId]: {
        [challengeId]: 3
      }
    };

    // function under test
    const output = helper.getStoredChallengeStatus(challenges, challengeId, familyId, false);

    // expectation
    expect(output).toEqual(challenges[familyId][challengeId]);
  });

  test('returns the available status', () => {
    // setup
    const familyId = 'm1f2';
    const challengeId = 'c2';
    const challenges = {
      [familyId]: {
        [challengeId]: 3
      }
    };

    // function under test
    const output = helper.getStoredChallengeStatus(challenges, 'c3', familyId, true);

    // expectation
    expect(output).toEqual(CHALLENGE_AVAILABLE_STATUS);
  });

  test('returns the unavailable status', () => {
    // setup
    const familyId = 'm1f2';
    const challengeId = 'c2';
    const challenges = {
      [familyId]: {
        [challengeId]: 3
      }
    };

    // function under test
    const output = helper.getStoredChallengeStatus(challenges, 'c3', familyId, false);

    // expectation
    expect(output).toEqual(CHALLENGE_UNAVAILABLE_STATUS);
  });
});

describe('method determineChallengeStatus()', () => {
  test('returns the failed status', () => {
    const output = helper.determineChallengeStatus('failed', 20);
    expect(output).toEqual(CHALLENGE_FAILED_STATUS);
  });

  test('returns the perfect status', () => {
    const output = helper.determineChallengeStatus('passed', 100);
    expect(output).toEqual(CHALLENGE_PERFECT_STATUS);
  });

  test('returns the completion status', () => {
    const output = helper.determineChallengeStatus('passed', 90);
    expect(output).toEqual(CHALLENGE_COMPLETION_STATUS);
  });

  test('returns the in progress status', () => {
    const output = helper.determineChallengeStatus('unknown', 0);
    expect(output).toEqual(CHALLENGE_IN_PROGRESS_STATUS);
  });

  test('returns the available status', () => {
    const output = helper.determineChallengeStatus('foo', 0);
    expect(output).toEqual(CHALLENGE_AVAILABLE_STATUS);
  });
});

describe('method getChallengeStatus()', () => {
  test('returns the not started class and sets the disabled flag to true', () => {
    const output = helper.getChallengeStatus(CHALLENGE_UNAVAILABLE_STATUS);
    expect(output).toEqual({
      className: CHALLENGE_NOT_STARTED_CLASS,
      disabled: true
    });
  });

  test('returns the available class and sets the disabled flag to false', () => {
    const output = [
      helper.getChallengeStatus(CHALLENGE_AVAILABLE_STATUS),
      helper.getChallengeStatus(CHALLENGE_IN_PROGRESS_STATUS),
      helper.getChallengeStatus(CHALLENGE_FAILED_STATUS)
    ];
    expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
      className: CHALLENGE_AVAILABLE_CLASS,
      disabled: false
    })]));
  });

  test('returns the completed class and sets the disabled flag to false', () => {
    const output = helper.getChallengeStatus(CHALLENGE_COMPLETION_STATUS);
    expect(output).toEqual({
      className: CHALLENGE_COMPLETED_CLASS,
      disabled: false
    });
  });

  test('returns the perfect class and sets the disabled flag to false', () => {
    const output = helper.getChallengeStatus(CHALLENGE_PERFECT_STATUS);
    expect(output).toEqual({
      className: CHALLENGE_PERFECT_CLASS,
      disabled: false
    });
  });

  test('returns the default class and sets the disabled flag to false', () => {
    const output = helper.getChallengeStatus(10000);
    expect(output).toEqual({
      className: CHALLENGE_NOT_STARTED_CLASS,
      disabled: false
    });
  });
});

describe('method getNextChallengeIndex()', () => {
  test('challenge not found return 0', () => {
    const challenges = [{ status: 'irrelevant' }];
    const output = helper.getNextChallengeIndex(challenges);
    expect(output).toEqual(0);
  });

  test('returns the index of the first available challegen', () => {
    const challenges = [{
      status: CHALLENGE_PERFECT_STATUS
    }, {
      status: CHALLENGE_AVAILABLE_STATUS
    }];
    const output = helper.getNextChallengeIndex(challenges);
    expect(output).toEqual(1);
  });
});

test('method findChallengeInChallenges()', () => {
  // setup
  const challenge = {
    id: 'c2',
    productId: 'p1',
    familyId: 'm1f1'
  };
  const challenges = {
    [challenge.familyId]: [{
      id: challenge.id,
      productId: challenge.productId,
      status: 1
    }]
  };

  // function under test
  const output = helper.findChallengeInChallenges(challenge, challenges);

  // expectation
  expect(output).toEqual(expect.objectContaining({
    status: expect.any(Number)
  }));
});

describe('method getChallengeXAPIStatus()', () => {
  test('perfect challenge', () => {
    const output = helper.getChallengeXAPIStatus(CHALLENGE_PERFECT_STATUS);
    expect(output).toEqual(expect.objectContaining({
      response: XAPI_PERFECT_CHALLENGE,
      score: XAPI_PERFECT_CHALLENGE_SCORE,
      success: true
    }));
  });

  test('completed challenge', () => {
    const output = helper.getChallengeXAPIStatus(CHALLENGE_COMPLETION_STATUS);
    expect(output).toEqual(expect.objectContaining({
      response: XAPI_COMPLETED_CHALLENGE,
      score: XAPI_COMPLETED_CHALLENGE_SCORE,
      success: true
    }));
  });

  test('failed challenge', () => {
    const output = [
      helper.getChallengeXAPIStatus(CHALLENGE_UNAVAILABLE_STATUS),
      helper.getChallengeXAPIStatus(CHALLENGE_AVAILABLE_STATUS),
      helper.getChallengeXAPIStatus(CHALLENGE_IN_PROGRESS_STATUS),
      helper.getChallengeXAPIStatus(CHALLENGE_FAILED_STATUS),
      helper.getChallengeXAPIStatus()
    ];

    expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
      response: XAPI_FAIL_CHALLENGE,
      score: XAPI_FAIL_CHALLENGE_SCORE,
      success: false
    })]));
  });
});
