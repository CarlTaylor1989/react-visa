import * as types from '../../actions/tutorialTypes';
import * as tutorialReducer from '../../reducers/tutorial';

let initialState;
let finalState;
beforeEach(() => {
  initialState = {
    ...tutorialReducer.initialState
  };
  finalState = {
    ...initialState
  };
});

test('returns the initial state', () => {
  expect(tutorialReducer.tutorialData(undefined, {})).toEqual(initialState);
});

test('SET_TUTORIAL_SLIDE_INDEX', () => {
  // setup
  const slideIndex = 2;
  finalState.slideIndex = slideIndex;

  // function under test
  const state = tutorialReducer.tutorialData(initialState, {
    type: types.SET_TUTORIAL_SLIDE_INDEX,
    slideIndex
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SET_TUTORIAL_LAUNCHED', () => {
  // setup
  const launched = true;
  finalState.launched = launched;

  // function under test
  const state = tutorialReducer.tutorialData(initialState, {
    type: types.SET_TUTORIAL_LAUNCHED,
    launched
  });

  // expectation
  expect(state).toEqual(finalState);
});
