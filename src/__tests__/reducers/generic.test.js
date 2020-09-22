import * as types from '../../actions/genericTypes';
import * as genericReducer from '../../reducers/generic';
import launchedWithinDays from '../../lib/time';

jest.mock('../../lib/time');

let initialState;
let finalState;
beforeEach(() => {
  initialState = {
    ...genericReducer.initialState
  };
  finalState = {
    ...initialState
  };
  launchedWithinDays.mockImplementation(() => false);
});

test('return the initial state', () => {
  expect(genericReducer.genericData(undefined, {})).toEqual(initialState);
});

test('CHANGE_SCREEN', () => {
  // setup
  const screen = 'game';
  finalState.screen = screen;

  // function under test
  const state = genericReducer.genericData(initialState, {
    type: types.CHANGE_SCREEN,
    screen
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('RESET_SCREEN', () => {
  // setup
  initialState.screen = 'irrelevant';

  // function under test
  const state = genericReducer.genericData(initialState, {
    type: types.RESET_SCREEN
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SUSPEND_DATA_PARSED', () => {
  // setup
  const dataReady = true;
  finalState.dataReady = dataReady;

  // function under test
  const state = genericReducer.genericData(initialState, {
    type: types.SUSPEND_DATA_PARSED,
    dataReady
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('DISABLE_FEEDBACK', () => {
  // setup
  finalState = {
    ...finalState,
    feedback: {
      ...finalState.feedback,
      lastUpdatedDate: expect.any(Number),
      disabled: true
    }
  };

  // function under test
  const state = genericReducer.genericData(initialState, {
    type: types.DISABLE_FEEDBACK
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SET_GENERIC_DATA', () => {
  // setup
  const data = {
    launched: 1,
    consecutive: 2,
    clientIntroSeen: true,
    feedback: {
      days: 2,
      triggered: false,
      lastUpdatedDate: new Date().getTime()
    },
    introSeqCompleted: true,
    networkIntroSeen: true
  };
  finalState = {
    ...finalState,
    canDisplayIntroPopup: false,
    clientIntroSeen: true,
    consecutive: expect.any(Number),
    launched: expect.any(Number),
    feedback: expect.any(Object),
    introSeqCompleted: true,
    networkIntroSeen: true
  };

  // function under test
  const state = genericReducer.genericData(initialState, {
    type: types.SET_GENERIC_DATA,
    data
  });

  // expectation
  expect(state).toEqual(finalState);
});

describe('UPDATE_LAUNCHED', () => {
  test('returns the original state', () => {
    finalState.launched = expect.any(Number);
    const state = genericReducer.genericData(initialState, {
      type: types.UPDATE_LAUNCHED
    });
    expect(state).toEqual(finalState);
  });

  test('reset the consecutive days', () => {
    // setup
    initialState.launched = new Date().setTime(new Date().getTime() - (34 * 60 * 60 * 1000));
    initialState.consecutive = 4;
    finalState.launched = expect.any(Number);
    finalState.consecutive = 1;

    // function under test
    const state = genericReducer.genericData(initialState, {
      type: types.UPDATE_LAUNCHED
    });

    // expectation
    expect(state).toEqual(finalState);
  });

  test('increases the consecutive days', () => {
    // setup
    initialState.launched = new Date().setTime(new Date().getTime() - (15 * 60 * 60 * 1000));
    initialState.consecutive = 2;
    finalState.launched = expect.any(Number);
    finalState.consecutive = 3;

    // function under test
    const state = genericReducer.genericData(initialState, {
      type: types.UPDATE_LAUNCHED
    });

    // expectation
    expect(state).toEqual(finalState);
  });

  test('game launched the same day', () => {
    // setup
    initialState.launched = new Date().getTime();
    initialState.consecutive = 2;
    finalState.launched = initialState.launched;
    finalState.consecutive = initialState.consecutive;

    // function under test
    const state = genericReducer.genericData(initialState, {
      type: types.UPDATE_LAUNCHED
    });

    // expectation
    expect(state).toEqual(finalState);
  });
});

test('SET_SCREEN_REFERRER', () => {
  // setup
  const screenReferrer = 'irrelevant';
  finalState = {
    ...finalState,
    screenReferrer
  };

  // function under test
  const state = genericReducer.genericData(initialState, {
    type: types.SET_SCREEN_REFERRER,
    screenReferrer
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SET_POPUP_REFERRER', () => {
  // setup
  const popupReferrer = 'irrelevant';
  finalState = {
    ...finalState,
    popupReferrer
  };

  // function under test
  const state = genericReducer.genericData(initialState, {
    type: types.SET_POPUP_REFERRER,
    popupReferrer
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SET_PRODUCT_PAGE_INACTIVE', () => {
  // setup
  const productPageInactive = 'irrelevant';
  finalState = {
    ...finalState,
    productPageInactive
  };

  // function under test
  const state = genericReducer.genericData(initialState, {
    type: types.SET_PRODUCT_PAGE_INACTIVE,
    productPageInactive
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('TOGGLE_SETTINGS_BTN_STATE', () => {
  // setup
  finalState = {
    ...finalState,
    settingsBtnEnabled: false
  };

  // function under test
  const state = genericReducer.genericData(initialState, {
    type: types.TOGGLE_SETTINGS_BTN_STATE
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('method updateConsecutive()', () => {
  const consecutive = 3;
  const output = genericReducer.updateConsecutive(false, consecutive);
  expect(output).toEqual({
    launched: expect.any(Number),
    consecutive
  });
});

test('method updateFeedback()', () => {
  initialState.feedback.lastUpdatedDate = new Date(2019, 0, 1).getTime();
  const output = genericReducer.updateFeedback(initialState.feedback);
  expect(output).toEqual({
    ...initialState.feedback,
    days: expect.any(Number),
    lastUpdatedDate: expect.any(Number)
  });
});

test('SET_CLIENT_INTRO_SEEN', () => {
  // setup
  finalState = {
    ...finalState,
    clientIntroSeen: true,
    clientIntroSeenSession: true
  };

  // function under test
  const state = genericReducer.genericData(initialState, {
    type: types.SET_CLIENT_INTRO_SEEN
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SET_NETWORK_INTRO_SEEN', () => {
  // setup
  finalState = {
    ...finalState,
    networkIntroSeen: true,
    networkIntroSeenSession: true
  };

  // function under test
  const state = genericReducer.genericData(initialState, {
    type: types.SET_NETWORK_INTRO_SEEN
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SET_INTRO_SEQ_COMPLETED', () => {
  // setup
  finalState = {
    ...finalState,
    introSeqCompleted: true
  };

  // function under test
  const state = genericReducer.genericData(initialState, {
    type: types.SET_INTRO_SEQ_COMPLETED
  });

  // expectation
  expect(state).toEqual(finalState);
});
