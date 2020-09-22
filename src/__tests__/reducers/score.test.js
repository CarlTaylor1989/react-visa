import * as types from '../../actions/scoreTypes';
import * as scoreReducer from '../../reducers/score';
import { getRankId } from '../../lib/ranks';

jest.mock('../../lib/ranks');

let initialState;
let finalState;
beforeEach(() => {
  initialState = {
    ...scoreReducer.initialState
  };
  finalState = {
    ...initialState,
    categories: {
      ...initialState.categories
    },
    rank: expect.any(String),
  };
  getRankId.mockImplementation(() => 'irrelevant');
});

test('return the initial state', () => {
  expect(scoreReducer.scoreData(undefined, {})).toEqual(initialState);
});

test('SET_TOTAL_SCORE', () => {
  // setup
  const score = 1000;
  finalState.total = score;
  finalState.scoreToDisplay = score;
  finalState.displayedScore = score;

  // function under test
  const state = scoreReducer.scoreData(initialState, {
    type: types.SET_TOTAL_SCORE,
    score
  });

  // expectations
  expect(state).toEqual(finalState);
  expect(getRankId).toHaveBeenCalledWith(score);
});

test('SET_DISPLAYED_SCORE', () => {
  // setup
  initialState.scoreToDisplay = 1000;
  initialState.total = 2000;
  finalState.displayedScore = initialState.scoreToDisplay;
  finalState.scoreToDisplay = initialState.total;
  finalState.total = initialState.total;

  // function under test
  const state = scoreReducer.scoreData(initialState, {
    type: types.SET_DISPLAYED_SCORE
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('UPDATE_DISPLAYED_SCORE', () => {
  // setup
  initialState.total = 1000;
  finalState.displayedScore = initialState.total;
  finalState.total = initialState.total;

  // function under test
  const state = scoreReducer.scoreData(initialState, {
    type: types.UPDATE_DISPLAYED_SCORE
  });

  // expectation
  expect(state).toEqual(finalState);
});


test('SET_RUNNING_SCORE', () => {
  // setup
  const score = 1000;
  finalState.running = score;

  // function under test
  const state = scoreReducer.scoreData(initialState, {
    type: types.SET_RUNNING_SCORE,
    score
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SET_RANK', () => {
  // setup
  const rank = 1000;
  finalState.rank = rank;

  // function under test
  const state = scoreReducer.scoreData(initialState, {
    type: types.SET_RANK,
    rank
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SET_SCORES', () => {
  // setup
  const running = 100;
  const total = 500;
  finalState.running = running;
  finalState.displayedScore = total;
  finalState.scoreToDisplay = total;
  finalState.total = total;

  // function under test
  const state = scoreReducer.scoreData(initialState, {
    type: types.SET_SCORES,
    running,
    total
  });

  // expectations
  expect(state).toEqual(finalState);
});

describe('INCREASE_SCORE', () => {
  test('new rank, rankIncreaseSession set to true', () => {
    // setup
    const score = 1000;
    finalState.running = score;
    finalState.total = score;
    finalState.rankIncreaseSession = true;

    // function under test
    const state = scoreReducer.scoreData(initialState, {
      type: types.INCREASE_SCORE,
      score
    });

    // expectations
    expect(state).toEqual(finalState);
    expect(getRankId).toHaveBeenCalledWith(score);
  });

  test('same rank, rankIncreaseSession stays the same', () => {
    // setup
    const score = 0;
    finalState.running = score;
    finalState.total = score;
    finalState.rankIncreaseSession = false;
    getRankId.mockImplementation(() => 'r20');

    // function under test
    const state = scoreReducer.scoreData(initialState, {
      type: types.INCREASE_SCORE,
      score
    });

    // expectations
    expect(state).toEqual(finalState);
    expect(getRankId).toHaveBeenCalledWith(score);
  });
});

test('DECREASE_SCORE', () => {
  // setup
  const score = 1000;
  finalState.running = -score;
  finalState.total = -score;

  // function under test
  const state = scoreReducer.scoreData(initialState, {
    type: types.DECREASE_SCORE,
    score
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SET_CATEGORIES', () => {
  // setup
  const categories = {
    challenges: 1,
    products: 2
  };
  finalState.categories = {
    ...finalState.categories,
    ...categories
  };

  // function under test
  const state = scoreReducer.scoreData(initialState, {
    type: types.SET_CATEGORIES,
    categories
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('INCREASE_CHALLENGES_COMPLETED', () => {
  // setup
  finalState.categories = {
    ...finalState.categories,
    challenges: 1
  };

  // function under test
  const state = scoreReducer.scoreData(initialState, {
    type: types.INCREASE_CHALLENGES_COMPLETED
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('INCREASE_PERFECT_BONUS', () => {
  // setup
  finalState.categories = {
    ...finalState.categories,
    perfectBonus: 1
  };

  // function under test
  const state = scoreReducer.scoreData(initialState, {
    type: types.INCREASE_PERFECT_BONUS
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('INCREASE_STREAK_BONUS', () => {
  // setup
  finalState.categories = {
    ...finalState.categories,
    streakBonus: 1
  };

  // function under test
  const state = scoreReducer.scoreData(initialState, {
    type: types.INCREASE_STREAK_BONUS
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('INCREASE_PRODUCTS_COMPLETED', () => {
  // setup
  finalState.categories = {
    ...finalState.categories,
    products: 1
  };

  // function under test
  const state = scoreReducer.scoreData(initialState, {
    type: types.INCREASE_PRODUCTS_COMPLETED
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('INCREASE_CLIENT_NEEDS', () => {
  // setup
  finalState.categories = {
    ...finalState.categories,
    clientNeeds: 1
  };

  // function under test
  const state = scoreReducer.scoreData(initialState, {
    type: types.INCREASE_CLIENT_NEEDS
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('INCREASE_PROPOSALS_COMPLETED', () => {
  // setup
  finalState.categories = {
    ...finalState.categories,
    proposals: 1
  };

  // function under test
  const state = scoreReducer.scoreData(initialState, {
    type: types.INCREASE_PROPOSALS_COMPLETED
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('INCREASE_ACHIEVEMENTS_UNLOCKED', () => {
  // setup
  finalState.categories = {
    ...finalState.categories,
    achievements: 1
  };

  // function under test
  const state = scoreReducer.scoreData(initialState, {
    type: types.INCREASE_ACHIEVEMENTS_UNLOCKED
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('RESET_RUNNING_CATEGORIES', () => {
  // setup
  initialState = {
    ...initialState,
    total: 1000,
  };
  finalState.total = 1000;

  // function under test
  const state = scoreReducer.scoreData(initialState, {
    type: types.RESET_RUNNING_CATEGORIES
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('RESET_ALL_SCORES', () => {
  const state = scoreReducer.scoreData(initialState, {
    type: types.RESET_ALL_SCORES
  });
  expect(state).toEqual(finalState);
});
