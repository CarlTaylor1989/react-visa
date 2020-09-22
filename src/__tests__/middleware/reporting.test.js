import {
  totalScoreReady,
  bonusSreakAchieved,
  bonusSreakLost,
  rankChanged,
  achievementsUnlocked,
  clientProposal
} from '../../middleware/reporting';
import * as streakTypes from '../../actions/streakTypes';
import * as achievementTypes from '../../actions/achievementTypes';
import * as clientTypes from '../../actions/clientTypes';
import { sendInteractionData } from '../../tracking/xapi/XApiAdapter';
import { CLIENT_NOT_STARTED, CLIENT_COMPLETED, CLIENT_GIVENUP } from '../../config/constants';
import { clientsPropsReferrer } from '../../config/referrers';

jest.mock('../../tracking/xapi/XApiAdapter');

const next = jest.fn();
let action;
let store;
beforeEach(() => {
  store = {
    dispatch: jest.fn(),
    getState: jest.fn()
  };
});

describe('method totalScoreReady()', () => {
  test('sends an xapi statement', () => {
    // setup
    action = {
      type: 'irrelvant',
      score: 1000
    };
    const totalScore = 10000;
    store.getState.mockReturnValue({
      scoreData: {
        total: totalScore
      }
    });

    // function under test
    totalScoreReady(store)(next)(action);

    // expectactions
    expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
      type: 'scored',
      activity: expect.objectContaining({
        type: 'course'
      }),
      result: expect.objectContaining({
        score: expect.objectContaining({
          raw: totalScore
        })
      })
    }));
  });

  test('ignore actions', () => {
    action = { type: 'foo' };
    totalScoreReady(store)(next)(action);
    expect(sendInteractionData).not.toHaveBeenCalled();
  });
});

describe('method bonusSreakAchieved()', () => {
  test('sends an xapi statement', () => {
    // setup
    action = {
      type: streakTypes.INCREASE_STREAK
    };
    store.getState
      .mockReturnValueOnce({
        streakData: {
          active: true,
          completed: false
        }
      })
      .mockReturnValueOnce({
        streakData: {
          active: false,
          completed: true
        }
      });

    // function under test
    bonusSreakAchieved(store)(next)(action);

    // expectactions
    expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
      type: 'achieved',
      activity: expect.objectContaining({
        id: expect.any(String),
        type: 'goal',
        title: expect.any(String),
        description: expect.any(String)
      }),
      parent: 'streak'
    }));
  });

  test('bonus streak has already been completed', () => {
    // setup
    action = {
      type: streakTypes.INCREASE_STREAK
    };
    store.getState.mockReturnValue({
      streakData: {
        active: false,
        completed: true
      }
    });

    // function under test
    bonusSreakAchieved(store)(next)(action);

    // expectactions
    expect(sendInteractionData).not.toHaveBeenCalled();
  });

  test('ignore actions', () => {
    action = { type: 'foo' };
    bonusSreakAchieved(store)(next)(action);
    expect(sendInteractionData).not.toHaveBeenCalled();
  });
});

describe('method bonusSreakLost()', () => {
  test('sends an xapi statement', () => {
    // setup
    const gomoId = 'p1234';
    action = {
      type: streakTypes.RESET_STREAK_PROGRESS,
      challengeId: 'c1',
      familyId: 'f1'
    };
    store.getState
      .mockReturnValueOnce({
        streakData: {
          progress: 2
        }
      })
      .mockReturnValueOnce({
        mapData: {
          challenges: [{
            id: 'c1',
            familyId: 'f1',
            gomoId
          }]
        },
        streakData: {
          active: true
        }
      });

    // function under test
    bonusSreakLost(store)(next)(action);

    // expectactions
    expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
      type: 'lost',
      activity: expect.objectContaining({
        id: expect.any(String),
        type: 'goal',
        title: expect.any(String),
        description: expect.any(String)
      }),
      parent: 'streak',
      other: {
        type: 'gomo',
        projectId: gomoId
      }
    }));
  });

  test('bonus streak not active', () => {
    // setup
    action = {
      type: streakTypes.RESET_STREAK_PROGRESS
    };
    store.getState.mockReturnValue({
      streakData: {
        active: false
      }
    });

    // function under test
    bonusSreakLost(store)(next)(action);

    // expectactions
    expect(sendInteractionData).not.toHaveBeenCalled();
  });

  test('ignore actions', () => {
    action = { type: 'foo' };
    bonusSreakLost(store)(next)(action);
    expect(sendInteractionData).not.toHaveBeenCalled();
  });
});

describe('method rankChanged()', () => {
  test('sends an xapi statement', () => {
    // setup
    action = { score: 200000 };
    store.getState
      .mockReturnValueOnce({
        scoreData: {
          rank: 'r1'
        }
      })
      .mockReturnValueOnce({
        scoreData: {
          rank: 'r2',
          total: 1000
        }
      });

    // function under test
    rankChanged(store)(next)(action);

    // expectactions
    expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
      type: 'achieved',
      activity: expect.objectContaining({
        id: expect.any(String),
        type: 'goal',
        title: expect.any(String),
        description: expect.any(String)
      }),
      parent: 'rank'
    }));
  });

  test('rank remains the same', () => {
    // setup
    action = { score: 200000 };
    store.getState
      .mockReturnValueOnce({
        scoreData: {
          rank: 'r1'
        }
      })
      .mockReturnValueOnce({
        scoreData: {
          rank: 'r1'
        }
      });

    // function under test
    rankChanged(store)(next)(action);

    // expectaction
    expect(sendInteractionData).not.toHaveBeenCalled();
  });
});

describe('method achievementsUnlocked()', () => {
  test('sends an xapi statement', () => {
    // setup
    action = {
      type: achievementTypes.SET_COMPLETED_ACHIEVEMENT,
      achievement: 'ac1'
    };
    const totalScore = 10000;
    store.getState.mockReturnValue({
      scoreData: {
        total: totalScore
      }
    });

    // function under test
    achievementsUnlocked(store)(next)(action);

    // expectactions
    expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
      type: 'achieved',
      activity: expect.objectContaining({
        id: expect.any(String),
        type: 'goal',
        title: expect.any(String),
        description: expect.any(String)
      }),
      parent: 'achievements'
    }));
  });

  test('ignore actions', () => {
    action = { type: 'foo' };
    achievementsUnlocked(store)(next)(action);
    expect(sendInteractionData).not.toHaveBeenCalled();
  });
});

describe('method clientProposal()', () => {
  test('sends an xapi statement for a completed client proposal', () => {
    // setup
    action = {
      type: clientTypes.SET_CLIENT_STATUS,
      status: CLIENT_COMPLETED,
      client: 'client1'
    };

    // function under test
    clientProposal(store)(next)(action);

    // expectactions
    expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
      type: 'completed',
      activity: expect.objectContaining({
        id: expect.stringContaining(`${clientsPropsReferrer}/`),
        type: 'assessment',
        title: expect.any(String),
        description: expect.any(String)
      }),
      result: {
        completion: true,
        success: true
      },
      parent: expect.stringMatching(clientsPropsReferrer)
    }));
  });

  test('sends an xapi statement for a given up client proposal', () => {
    // setup
    action = {
      type: clientTypes.SET_CLIENT_STATUS,
      status: CLIENT_GIVENUP,
      client: 'client1'
    };

    // function under test
    clientProposal(store)(next)(action);

    // expectactions
    expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
      type: 'terminated',
      activity: expect.objectContaining({
        id: expect.stringContaining(`${clientsPropsReferrer}/`),
        type: 'assessment',
        title: expect.any(String),
        description: expect.any(String)
      }),
      result: {
        completion: true,
        success: false
      },
      parent: expect.stringMatching(clientsPropsReferrer)
    }));
  });

  test('statement not being sent', () => {
    // setup
    action = {
      type: clientTypes.SET_CLIENT_STATUS,
      status: CLIENT_NOT_STARTED,
      client: 'client1'
    };

    // function under test
    clientProposal(store)(next)(action);

    // expectactions
    expect(sendInteractionData).not.toHaveBeenCalled();
  });

  test('ignore actions', () => {
    action = { type: 'foo' };
    clientProposal(store)(next)(action);
    expect(sendInteractionData).not.toHaveBeenCalled();
  });
});
