import * as types from '../../actions/achievementTypes';
import * as achievementsReducer from '../../reducers/achievements';

let initialState;
let finalState;
beforeEach(() => {
  initialState = {
    ...achievementsReducer.initialState
  };
  finalState = {
    ...initialState
  };
});

test('return the initial state', () => {
  expect(achievementsReducer.achievementsData(undefined, {})).toEqual(initialState);
});

describe('SET_COMPLETED_ACHIEVEMENT', () => {
  test('adds an achievement to the completed list', () => {
    // setup
    const achievement = 'irrelevant';
    finalState = {
      ...finalState,
      achievementChanged: true,
      completed: [achievement],
      lastCompleted: achievement,
      completedThisSession: true
    };

    // function under test
    const state = achievementsReducer.achievementsData(initialState, {
      type: types.SET_COMPLETED_ACHIEVEMENT,
      achievement
    });

    // expectations
    expect(state).toEqual(finalState);
  });

  test('adds an achievement to the completed list which already exists', () => {
    // setup
    const achievement = 'irrelevant';
    initialState.completed = [achievement];
    // function under test
    const state = achievementsReducer.achievementsData(initialState, {
      type: types.SET_COMPLETED_ACHIEVEMENT,
      achievement
    });

    // expectations
    expect(state).toEqual(initialState);
  });
});

test('RESTORE_ACHIEVEMENTS', () => {
  // setup
  const completed = ['foo', 'bar'];
  const lastCompleted = 'foo';
  finalState = {
    ...finalState,
    completed,
    lastCompleted
  };

  // function under test
  const state = achievementsReducer.achievementsData(initialState, {
    type: types.RESTORE_ACHIEVEMENTS,
    completed,
    lastCompleted
  });

  // expectations
  expect(state).toEqual(finalState);
});

test('RESET_CHANGED_ACHIEVEMENT', () => {
  initialState.achievementChanged = true;
  const state = achievementsReducer.achievementsData(initialState, {
    type: types.RESET_CHANGED_ACHIEVEMENT
  });
  expect(state).toEqual(finalState);
});

test('RESET_ACHIEVEMENTS', () => {
  const state = achievementsReducer.achievementsData(initialState, {
    type: types.RESET_ACHIEVEMENTS
  });
  expect(state).toEqual(finalState);
});
