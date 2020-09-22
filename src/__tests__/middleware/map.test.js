import {
  setCompletedChallenges,
  setCompletedProducts,
  perfectChallenge
} from '../../middleware/map';
import * as types from '../../actions/mapTypes';
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

afterEach(() => {
  expect(next).toHaveBeenCalledWith(action);
});

describe('method setCompletedChallenges()', () => {
  describe('update challenge status action', () => {
    test('adds a completed challenge to the store', () => {
      // setup
      action = {
        type: types.UPDATE_CHALLENGE_STATUS,
        status: CHALLENGE_COMPLETION_STATUS,
        familyId: 'foo',
        id: 'bar'
      };
      store.getState.mockReturnValue({
        mapData: {
          completedChallenges: []
        }
      });

      // function under test
      setCompletedChallenges(store)(next)(action);

      // expectactions
      expect(store.dispatch).toHaveBeenCalledWith(expect.any(Object));
    });

    test('attempts to add a perfect challenge to the store that already exists', () => {
      // setup
      action = {
        type: types.UPDATE_CHALLENGE_STATUS,
        status: CHALLENGE_PERFECT_STATUS,
        familyId: 'foo',
        id: 'bar'
      };
      store.getState.mockReturnValue({
        mapData: {
          completedChallenges: ['foobar']
        }
      });

      // function under test
      setCompletedChallenges(store)(next)(action);

      // expectactions
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  test('sets the completed challenges', () => {
    action = {
      type: types.SET_CHALLENGES,
      challenges: [{
        familyId: 'f1',
        id: 'c1',
        status: CHALLENGE_COMPLETION_STATUS
      }, {
        familyId: 'f1',
        id: 'c2',
        status: CHALLENGE_PERFECT_STATUS
      }, {
        familyId: 'f1',
        id: 'c3',
        status: CHALLENGE_FAILED_STATUS
      }]
    };
    store.getState.mockReturnValue({
      mapData: {
        completedChallenges: []
      }
    });

    // function under test
    setCompletedChallenges(store)(next)(action);

    // expectactions
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Object));
  });

  test('ignores both actions', () => {
    action = { type: 'foo' };
    setCompletedChallenges(store)(next)(action);
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});

describe('method setCompletedProducts()', () => {
  describe('set last product completed action', () => {
    beforeEach(() => {
      action = {
        type: types.SET_LAST_PRODUCT_COMPLETED,
        lastProductCompleted: 'p1'
      };
    });

    test('adds a completed product to the store', () => {
      // setup
      store.getState.mockReturnValue({
        mapData: {
          currentFamily: 'm1f1',
          completedProducts: []
        }
      });

      // function under test
      setCompletedProducts(store)(next)(action);

      // expectactions
      expect(store.dispatch).toHaveBeenCalledWith(expect.any(Object));
      expect(store.dispatch).toHaveBeenCalledTimes(2);
    });

    test('attempts to add a completed product to the store that already exists', () => {
      // setup
      store.getState.mockReturnValue({
        mapData: {
          currentFamily: 'm1f1',
          completedProducts: ['m1f1p1']
        }
      });

      // function under test
      setCompletedProducts(store)(next)(action);
      action.lastProductCompleted = '';

      // expectactions
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  test('sets the completed products', () => {
    action = {
      type: types.SET_CHALLENGES,
      challenges: [{
        familyId: 'f1',
        id: 'c1',
        isFinal: true,
        status: CHALLENGE_COMPLETION_STATUS
      }, {
        familyId: 'f2',
        id: 'c1',
        isFinal: true,
        status: CHALLENGE_PERFECT_STATUS
      }, {
        familyId: 'f3',
        id: 'c1',
        status: CHALLENGE_FAILED_STATUS
      }]
    };
    store.getState.mockReturnValue({
      mapData: {
        completedProducts: []
      }
    });

    // function under test
    setCompletedProducts(store)(next)(action);

    // expectactions
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Object));
  });

  test('ignores both actions', () => {
    action = { type: 'foo' };
    setCompletedProducts(store)(next)(action);
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});

describe('method perfectChallenge()', () => {
  test('ignores the current action', () => {
    action = { type: 'foo' };
    perfectChallenge(store)(next)(action);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  test('dispatch a new action', () => {
    // setup
    action = {
      type: types.UPDATE_CHALLENGE_STATUS,
      status: CHALLENGE_PERFECT_STATUS,
      id: 'foo',
      familyId: 'bar'
    };

    // function under test
    perfectChallenge(store)(next)(action);

    // expectations
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Object));
  });
});
