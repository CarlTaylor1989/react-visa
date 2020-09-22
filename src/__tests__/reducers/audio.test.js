import * as types from '../../actions/audioTypes';
import * as audioReducer from '../../reducers/audio';

let initialState;
let finalState;
beforeEach(() => {
  initialState = {
    ...audioReducer.initialState
  };
  finalState = {
    ...initialState
  };
});

test('returns the initial state', () => {
  expect(audioReducer.audioData(undefined, {})).toEqual(initialState);
});

test('SET_AUDIO', () => {
  // setup
  const audioId = 'irrelevant';
  finalState.audioId = audioId;

  // function under test
  const state = audioReducer.audioData(initialState, {
    type: types.SET_AUDIO,
    audioId
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SET_PLAY_AUDIO', () => {
  // setup
  const audioId = 'irrelevant';
  finalState.audioId = audioId;

  // function under test
  const state = audioReducer.audioData(initialState, {
    type: types.SET_PLAY_AUDIO,
    audioId
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('PLAY_AUDIO', () => {
  const state = audioReducer.audioData(initialState, {
    type: types.PLAY_AUDIO
  });
  expect(state).toEqual(finalState);
});

test('PAUSE_AUDIO', () => {
  const state = audioReducer.audioData(initialState, {
    type: types.PAUSE_AUDIO
  });
  expect(state).toEqual(finalState);
});

test('STOP_AUDIO', () => {
  const state = audioReducer.audioData(initialState, {
    type: types.STOP_AUDIO
  });
  expect(state).toEqual(finalState);
});
