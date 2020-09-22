import * as types from '../../actions/settingsTypes';
import * as settingsReducer from '../../reducers/settings';

let initialState;
let finalState;
beforeEach(() => {
  initialState = {
    ...settingsReducer.initialState
  };
  finalState = {
    ...initialState
  };
});

test('returns the initial state', () => {
  expect(settingsReducer.settingsData(undefined, {})).toEqual(initialState);
});

test('TOGGLE_AUDIO_STATE', () => {
  // setup
  const audio = false;
  finalState.audio = audio;

  // function under test
  const state = settingsReducer.settingsData(initialState, {
    type: types.TOGGLE_AUDIO_STATE,
    audio
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('TOGGLE_TOOLTIPS_STATE', () => {
  // setup
  const tooltips = false;
  finalState.tooltips = tooltips;

  // function under test
  const state = settingsReducer.settingsData(initialState, {
    type: types.TOGGLE_TOOLTIPS_STATE,
    tooltips
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SET_SETTINGS', () => {
  // setup
  const settings = {
    audio: false,
    tooltips: false
  };
  finalState = {
    ...finalState,
    ...settings
  };

  // function under test
  const state = settingsReducer.settingsData(initialState, {
    type: types.SET_SETTINGS,
    settings
  });

  // expectation
  expect(state).toEqual(finalState);
});
