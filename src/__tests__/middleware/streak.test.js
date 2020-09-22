import streak from '../../middleware/streak';
import * as types from '../../actions/streakTypes';
import { MAXIMUM_STREAK } from '../../config/constants';

jest.mock('../../actions/streak');

const next = jest.fn();

describe('streak middleware', () => {
  let store;
  beforeEach(() => {
    store = {
      dispatch: jest.fn(),
      getState: jest.fn()
    };
  });

  test('ignores the current action', () => {
    store.getState.mockReturnValue({
      streakData: {
        active: true
      }
    });
    streak(store)(next)({ type: 'foo' });
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Object));
  });

  test('calls next but not dispatch', () => {
    // setup
    const action = {
      type: types.INCREASE_STREAK,
    };

    store.getState.mockReturnValue({
      streakData: {
        active: true,
        progress: 0
      }
    });

    // function under test
    streak(store)(next)(action);

    // expectations
    expect(next).toHaveBeenCalledWith(expect.any(Object));
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  test('dispatch action if the streak value is MAXIMUM_STREAK', () => {
    // setup
    const action = {
      type: types.INCREASE_STREAK,
    };

    store.getState.mockReturnValue({
      streakData: {
        active: true,
        progress: MAXIMUM_STREAK
      }
    });

    // function under test
    streak(store)(next)(action);

    // expectations
    expect(next).toHaveBeenCalledWith(expect.any(Object));
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Object));
    expect(store.dispatch).toHaveBeenCalledTimes(3);
  });

  test('call next but does not dispatch if streak inactive', () => {
    // setup
    const action = {
      type: types.INCREASE_STREAK
    };

    store.getState.mockReturnValue({
      streakData: {
        active: false,
        progress: 0
      }
    });

    // function under test
    streak(store)(next)(action);

    // expectations
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Object));
  });
});
