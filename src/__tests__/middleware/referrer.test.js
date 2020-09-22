import { screenReferrer } from '../../middleware/referrer';
import * as types from '../../actions/genericTypes';
import { dashboardReferrer, mapReferrer } from '../../config/referrers';

const next = jest.fn();
let action;
let store;
beforeEach(() => {
  store = {
    getState: jest.fn()
  };
});

describe('method screenReferrer()', () => {
  beforeEach(() => {
    action = {
      type: types.SET_SCREEN_REFERRER,
      screenReferrer: mapReferrer
    };
  });

  test('action payload is overriden', () => {
    // setup
    store.getState.mockReturnValue({
      genericData: {
        screenReferrer: dashboardReferrer
      }
    });

    // function under test
    screenReferrer(store)(next)(action);

    // expectation
    expect(next).toHaveBeenCalledWith({
      type: action.type,
      screenReferrer: dashboardReferrer
    });
  });

  test('action payload remains the same', () => {
    store.getState.mockReturnValue({
      genericData: {
        screenReferrer: 'irrelevant'
      }
    });
    screenReferrer(store)(next)(action);
    expect(next).toHaveBeenCalledWith(action);
  });
});
