import {
  challengeAchievements,
  productAchievements,
  settingsAchievement,
  timedAchievement,
  scoredAchievements,
  lib
} from '../../middleware/achievements';
import * as mapTypes from '../../actions/mapTypes';
import * as achievTypes from '../../actions/achievementTypes';
import { groups } from '../../config/achievements';
import {
  CHALLENGE_FAILED_STATUS,
  CHALLENGE_COMPLETION_STATUS,
  CHALLENGE_PERFECT_STATUS
} from '../../config/constants';

const next = jest.fn();
const store = {
  dispatch: jest.fn(),
  getState: jest.fn()
};
let action;

beforeEach(() => {
  jest.resetAllMocks();
});

test('method lib.getGroupedAchievements()', () => {
  const output = lib.getGroupedAchievements(groups.challenges);
  expect(output).toEqual(expect.arrayContaining([expect.any(Object)]));
});

test('method lib.dispatchActions()', () => {
  lib.dispatchActions(store.dispatch, 'foo', 100);
  expect(store.dispatch).toHaveBeenCalledWith(expect.any(Object));
  expect(store.dispatch).toHaveBeenCalledTimes(4);
});

describe('method challengeAchievements()', () => {
  beforeEach(() => {
    lib.dispatchActions = jest.fn();
  });

  afterEach(() => {
    expect(next).toHaveBeenCalledWith(action);
  });

  describe('update challenge status action', () => {
    test('no achievements completed and challenge is completed', () => {
      // setup
      store.getState.mockReturnValue({
        achievementsData: {
          completed: []
        },
        mapData: {
          completedChallenges: ['c1']
        },
        streakData: {
          progress: 3
        }
      });
      lib.getGroupedAchievements = jest.fn().mockReturnValue([{
        available: true,
        id: 'ac1',
        max: 1,
        score: 1000
      }]);
      action = {
        type: mapTypes.UPDATE_CHALLENGE_STATUS,
        status: CHALLENGE_COMPLETION_STATUS,
        familyId: 'm1d1',
        id: 'c2'
      };

      // function under test
      challengeAchievements(store)(next)(action);

      // expectation
      expect(lib.dispatchActions).toHaveBeenCalledWith(
        store.dispatch,
        expect.any(String),
        expect.any(Number)
      );
    });

    test('no achievements completed and challenge is perfect', () => {
      // setup
      store.getState.mockReturnValue({
        achievementsData: {
          completed: []
        },
        mapData: {
          completedChallenges: ['c1', 'c2']
        },
        streakData: {
          progress: 3
        }
      });
      lib.getGroupedAchievements = jest.fn().mockReturnValue([{
        available: true,
        id: 'ac2',
        max: 2,
        score: 1000
      }]);
      action = {
        type: mapTypes.UPDATE_CHALLENGE_STATUS,
        status: CHALLENGE_PERFECT_STATUS,
        familyId: 'm1f1',
        id: 'c3'
      };

      // function under test
      challengeAchievements(store)(next)(action);

      // expectation
      expect(lib.dispatchActions).toHaveBeenCalledWith(
        store.dispatch,
        expect.any(String),
        expect.any(Number)
      );
    });

    test('no achievements completed and challenge is failed with the streak being 3 ', () => {
      // setup
      store.getState.mockReturnValue({
        achievementsData: {
          completed: []
        },
        mapData: {
          completedChallenges: ['c1', 'c2']
        },
        streakData: {
          progress: 3
        }
      });
      lib.getGroupedAchievements = jest.fn().mockReturnValue([{
        available: true,
        id: 'ac3',
        progress: 3,
        score: 1000
      }]);
      action = {
        type: mapTypes.UPDATE_CHALLENGE_STATUS,
        status: CHALLENGE_FAILED_STATUS,
        familyId: 'm1f1',
        id: 'c3'
      };

      // function under test
      challengeAchievements(store)(next)(action);

      // expectation
      expect(lib.dispatchActions).toHaveBeenCalledWith(
        store.dispatch,
        expect.any(String),
        expect.any(Number)
      );
    });

    test('achievement already completed', () => {
      // setup
      store.getState.mockReturnValue({
        achievementsData: {
          completed: ['ac1']
        },
        mapData: {
          completedChallenges: ['c1', 'c2']
        },
        streakData: {
          progress: 1
        }
      });
      lib.getGroupedAchievements = jest.fn().mockReturnValue([{
        available: true,
        id: 'ac1',
        max: 1,
        score: 1000
      }]);
      action = {
        type: mapTypes.UPDATE_CHALLENGE_STATUS,
        status: CHALLENGE_PERFECT_STATUS,
        familyId: 'm1f1',
        id: 'c3'
      };

      // function under test
      challengeAchievements(store)(next)(action);

      // expectations
      expect(lib.dispatchActions).not.toHaveBeenCalled();
    });

    test('no achievements completed and achievement not available', () => {
      // setup
      store.getState.mockReturnValue({
        achievementsData: {
          completed: []
        },
        mapData: {
          completedChallenges: ['c1']
        },
        streakData: {
          progress: 2
        }
      });
      lib.getGroupedAchievements = jest.fn().mockReturnValue([{
        available: true,
        id: 'ac1',
        score: 1000
      }]);
      action = {
        type: mapTypes.UPDATE_CHALLENGE_STATUS,
        status: CHALLENGE_PERFECT_STATUS,
        familyId: 'm1f1',
        id: 'c3'
      };

      // function under test
      challengeAchievements(store)(next)(action);

      // expectations
      expect(lib.dispatchActions).not.toHaveBeenCalled();
    });
  });

  test('ignores the current action', () => {
    action = { type: 'foo' };
    challengeAchievements(store)(next)(action);
    expect(lib.dispatchActions).not.toHaveBeenCalled();
  });
});

describe('method productAchievements()', () => {
  beforeEach(() => {
    lib.dispatchActions = jest.fn();
  });

  afterEach(() => {
    expect(next).toHaveBeenCalledWith(action);
  });

  describe('add completed product action', () => {
    test('no achievements completed and one product is completed', () => {
      // setup
      store.getState.mockReturnValue({
        achievementsData: {
          completed: []
        },
        mapData: {
          completedProducts: ['p1']
        }
      });
      lib.getGroupedAchievements = jest.fn().mockReturnValue([{
        available: true,
        id: 'ac1',
        max: 1,
        score: 1000
      }]);
      action = {
        type: mapTypes.ADD_COMPLETED_PRODUCT
      };

      // function under test
      productAchievements(store)(next)(action);

      // expectations
      expect(lib.dispatchActions).toHaveBeenCalledWith(
        store.dispatch,
        expect.any(String),
        expect.any(Number)
      );
    });

    test('achievement completed and one product is completed', () => {
      // setup
      store.getState.mockReturnValue({
        achievementsData: {
          completed: ['ac2']
        },
        mapData: {
          completedProducts: ['p1']
        }
      });
      lib.getGroupedAchievements = jest.fn().mockReturnValue([{
        id: 'ac2',
        max: 1,
        score: 1000
      }]);
      action = {
        type: mapTypes.ADD_COMPLETED_PRODUCT
      };

      // function under test
      productAchievements(store)(next)(action);

      // expectations
      expect(lib.dispatchActions).not.toHaveBeenCalled();
    });
  });

  test('ignores the current action', () => {
    action = { type: 'foo' };
    productAchievements(store)(next)(action);
    expect(lib.dispatchActions).not.toHaveBeenCalled();
  });
});

describe('method settingsAchievement()', () => {
  beforeEach(() => {
    lib.dispatchActions = jest.fn();
  });

  afterEach(() => {
    expect(next).toHaveBeenCalledWith(action);
  });

  describe('update settings achievements action', () => {
    test('no achievements completed', () => {
      // setup
      store.getState.mockReturnValue({
        achievementsData: {
          completed: [],
        }
      });
      lib.getGroupedAchievements = jest.fn().mockReturnValue([{
        available: true,
        id: 'ac1',
        score: 1000
      }]);
      action = {
        type: achievTypes.UPDATE_SETTINGS_ACHIEVEMENTS
      };

      // function under test
      settingsAchievement(store)(next)(action);

      // expectations
      expect(lib.dispatchActions).toHaveBeenCalledWith(
        store.dispatch,
        expect.any(String),
        expect.any(Number)
      );
    });

    test('settings achievement already completed', () => {
      // setup
      store.getState.mockReturnValue({
        achievementsData: {
          completed: ['ac2']
        }
      });
      lib.getGroupedAchievements = jest.fn().mockReturnValue([{
        id: 'ac2',
        score: 1000
      }]);
      action = {
        type: achievTypes.UPDATE_SETTINGS_ACHIEVEMENTS
      };

      // function under test
      settingsAchievement(store)(next)(action);

      // expectations
      expect(lib.dispatchActions).not.toHaveBeenCalled();
    });
  });

  test('ignores the current action', () => {
    action = { type: 'foo' };
    settingsAchievement(store)(next)(action);
    expect(lib.dispatchActions).not.toHaveBeenCalled();
  });
});

describe('method timedAchievement()', () => {
  beforeEach(() => {
    lib.dispatchActions = jest.fn();
  });

  afterEach(() => {
    expect(next).toHaveBeenCalledWith(action);
  });

  describe('update timed achievements action', () => {
    test('no achievements completed', () => {
      // setup
      store.getState.mockReturnValue({
        achievementsData: {
          completed: []
        },
        genericData: {
          consecutive: 2
        }
      });
      lib.getGroupedAchievements = jest.fn().mockReturnValue([{
        available: true,
        id: 'ac1',
        max: 2,
        score: 1000
      }]);
      action = {
        type: achievTypes.UPDATE_TIMED_ACHIEVEMENTS
      };

      // function under test
      timedAchievement(store)(next)(action);

      // expectations
      expect(lib.dispatchActions).toHaveBeenCalledWith(
        store.dispatch,
        expect.any(String),
        expect.any(Number)
      );
    });

    test('timed achievement already completed', () => {
      // setup
      store.getState.mockReturnValue({
        achievementsData: {
          completed: ['ac2']
        },
        genericData: {
          consecutive: 2
        }
      });
      lib.getGroupedAchievements = jest.fn().mockReturnValue([{
        id: 'ac2',
        max: 1,
        score: 2000
      }]);
      action = {
        type: achievTypes.UPDATE_TIMED_ACHIEVEMENTS
      };

      // function under test
      timedAchievement(store)(next)(action);

      // expectations
      expect(lib.dispatchActions).not.toHaveBeenCalled();
    });
  });

  test('ignores the current action', () => {
    action = { type: 'foo' };
    timedAchievement(store)(next)(action);
    expect(lib.dispatchActions).not.toHaveBeenCalled();
  });
});

describe('method scoredAchievements()', () => {
  beforeEach(() => {
    lib.dispatchActions = jest.fn();
  });

  afterEach(() => {
    expect(next).toHaveBeenCalledWith(action);
  });

  describe('actions with a scored property', () => {
    test('no achievements completed', () => {
      // setup
      store.getState.mockReturnValue({
        achievementsData: {
          completed: []
        },
        scoreData: {
          total: 15000
        }
      });
      lib.getGroupedAchievements = jest.fn().mockReturnValue([{
        available: true,
        id: 'ac1',
        max: 7000,
        score: 5000
      }]);
      action = {
        type: 'irrelevant',
        score: 10000
      };

      // function under test
      scoredAchievements(store)(next)(action);

      // expectations
      expect(lib.dispatchActions).toHaveBeenCalledWith(
        store.dispatch,
        expect.any(String),
        expect.any(Number)
      );
    });

    test('scored achievement already completed', () => {
      // setup
      store.getState.mockReturnValue({
        achievementsData: {
          completed: ['ac2']
        },
        scoreData: {
          total: 15000
        }
      });
      lib.getGroupedAchievements = jest.fn().mockReturnValue([{
        id: 'ac2',
        max: 7000,
        score: 5000
      }]);
      action = {
        type: 'irrelevant',
        score: 10000
      };

      // function under test
      scoredAchievements(store)(next)(action);

      // expectations
      expect(lib.dispatchActions).not.toHaveBeenCalled();
    });
  });

  test('ignores the current action', () => {
    action = { type: 'foo' };
    scoredAchievements(store)(next)(action);
    expect(lib.dispatchActions).not.toHaveBeenCalled();
  });
});
