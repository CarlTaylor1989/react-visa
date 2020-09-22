import * as types from '../../actions/streakTypes';
import * as streakReducer from '../../reducers/streak';
import { MAXIMUM_STREAK } from '../../config/constants';

let initialState;
let finalState;
beforeEach(() => {
  jest.resetAllMocks();
  initialState = {
    ...streakReducer.initialState
  };
  finalState = {
    ...initialState,
    lastCompleted: expect.any(Number)
  };
});

test('return the initial state', () => {
  expect(streakReducer.streakData(undefined, {})).toEqual(initialState);
});

describe('INCREASE_STREAK', () => {
  test('increases the streak by 1', () => {
    // setup
    finalState.progress = 1;

    // function under test
    const state = streakReducer.streakData(initialState, {
      type: types.INCREASE_STREAK
    });

    // expectations
    expect(state).toEqual(finalState);
  });

  test('increases the streak by 1 and disables the streak', () => {
    // setup
    initialState.progress = 3;
    finalState = {
      ...finalState,
      active: false,
      completed: true,
      progress: MAXIMUM_STREAK
    };

    // function under test
    const state = streakReducer.streakData(initialState, {
      type: types.INCREASE_STREAK
    });

    // expectations
    expect(state).toEqual(finalState);
  });

  test('maximum streak has already been achieved', () => {
    // setup
    initialState = {
      ...initialState,
      active: false,
      completed: true,
      progress: MAXIMUM_STREAK,
      lastCompleted: new Date().getTime()
    };
    finalState = {
      ...initialState
    };

    // function under test
    const state = streakReducer.streakData(initialState, {
      type: types.INCREASE_STREAK
    });

    // expectations
    expect(state).toEqual(finalState);
  });
});

test('SET_STREAK', () => {
  // setup
  const data = { active: true };
  finalState = {
    ...finalState,
    ...data
  };

  // function under test
  const state = streakReducer.streakData(initialState, {
    type: types.SET_STREAK,
    data
  });

  // expectations
  expect(state).toEqual(finalState);
});

describe('RESET_STREAK_PROGRESS', () => {
  test('sets the progress to 0', () => {
    // function under test
    const state = streakReducer.streakData(initialState, {
      type: types.RESET_STREAK_PROGRESS,
    });

    // expectations
    expect(state).toEqual(finalState);
  });

  test('cannot set the progress to 0', () => {
    // setup
    initialState.active = false;
    initialState.progress = 4;
    finalState = {
      ...finalState,
      ...initialState
    };

    // function under test
    const state = streakReducer.streakData(initialState, {
      type: types.RESET_STREAK_PROGRESS,
    });

    // expectations
    expect(state).toEqual(finalState);
  });
});

describe('CHECK_STREAK_STATUS', () => {
  test('returns the initial state', () => {
    // setup
    initialState = {
      active: false,
      completed: true,
      lastCompleted: 0,
      progress: MAXIMUM_STREAK,
      tutorialCriteriaMet: false
    };

    // function under test
    const state = streakReducer.streakData(initialState, {
      type: types.CHECK_STREAK_STATUS
    });

    // expectations
    expect(state).toEqual(finalState);
  });

  test('streak remains active', () => {
    // setup
    initialState = {
      active: true,
      completed: false,
      lastCompleted: expect.any(Number),
      progress: 3
    };
    finalState = {
      ...initialState
    };

    // function under test
    const state = streakReducer.streakData(initialState, {
      type: types.CHECK_STREAK_STATUS
    });

    // expectations
    expect(state).toEqual(finalState);
  });
  test('streak remains deactivated', () => {
    // setup
    initialState = {
      active: false,
      completed: true,
      lastCompleted: new Date().getTime(),
      progress: MAXIMUM_STREAK
    };

    // function under test
    const state = streakReducer.streakData(initialState, {
      type: types.CHECK_STREAK_STATUS
    });

    // expectations
    expect(state).toEqual(initialState);
  });
});
