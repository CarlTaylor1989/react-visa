import * as types from '../../actions/diagnosticTypes';
import * as diagnosticReducer from '../../reducers/diagnostic';

let initialState;
let finalState;
beforeEach(() => {
  initialState = {
    ...diagnosticReducer.initialState
  };
  finalState = {
    ...initialState
  };
});

test('return the initial state', () => {
  expect(diagnosticReducer.diagnosticData(undefined, {})).toEqual(initialState);
});

test('SET_DIAGNOSTIC_COMPLETION', () => {
  // setup
  const completed = true;
  finalState.completed = completed;

  // function under test
  const state = diagnosticReducer.diagnosticData(initialState, {
    type: types.SET_DIAGNOSTIC_COMPLETION,
    completed
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SET_DIAGNOSTIC_VISITED', () => {
  finalState.visited = true;
  const state = diagnosticReducer.diagnosticData(initialState, {
    type: types.SET_DIAGNOSTIC_VISITED,
  });
  expect(state).toEqual(finalState);
});

test('SET_REGION', () => {
  const region = 'eu';
  finalState.region = region;
  const state = diagnosticReducer.diagnosticData(initialState, {
    type: types.SET_REGION,
    region
  });
  expect(state).toEqual(finalState);
});

test('RESET_DIAGNOSTIC', () => {
  const state = diagnosticReducer.diagnosticData(initialState, {
    type: types.RESET_DIAGNOSTIC
  });
  expect(state).toEqual(finalState);
});

test('SET_DIAGNOSTIC_DATA', () => {
  const region = 'eu';
  const completed = true;
  const visited = true;
  const data = { region, completed, visited };
  finalState.region = region;
  finalState.completed = completed;
  finalState.visited = visited;
  const state = diagnosticReducer.diagnosticData(initialState, {
    type: types.SET_DIAGNOSTIC_DATA,
    data
  });
  expect(state).toEqual(finalState);
});
