import * as types from '../../actions/hintsTypes';
import * as hintsReducer from '../../reducers/hints';

let initialState;
let finalState;
beforeEach(() => {
  initialState = {
    ...hintsReducer.initialState
  };
  finalState = {
    ...initialState
  };
});

test('return the initial state', () => {
  expect(hintsReducer.hintsData(undefined, {})).toEqual(initialState);
});

test('SET_CURRENT_HINT_GROUP', () => {
  const group = 'diagnostic';
  finalState.currentGroup = group;
  const state = hintsReducer.hintsData(initialState, {
    type: types.SET_CURRENT_HINT_GROUP,
    group
  });

  expect(state).toEqual(finalState);
});

test('SET_HINT_GROUP_INDEX', () => {
  const hints = { group: 'diagnostic', index: 1 };
  finalState = {
    ...initialState,
    hints: initialState.hints.map(hint => (
      hint.group === hints.group ? {
        ...hints,
        index: hints.index
      } : hint))
  };
  const state = hintsReducer.hintsData(initialState, {
    type: types.SET_HINT_GROUP_INDEX,
    hints
  });

  expect(state).toEqual(finalState);
});

test('SET_HINTS_PAUSED', () => {
  const paused = true;
  finalState.paused = paused;
  const state = hintsReducer.hintsData(initialState, {
    type: types.SET_HINTS_PAUSED,
    paused
  });

  expect(state).toEqual(finalState);
});
