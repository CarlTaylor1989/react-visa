import * as types from '../../actions/promptTypes';
import * as promptsReducers from '../../reducers/prompts';

let initialState;
let finalState;
beforeEach(() => {
  initialState = {
    ...promptsReducers.initialState
  };
  finalState = {
    ...initialState
  };
});

test('return the initial state', () => {
  expect(promptsReducers.promptsData(undefined, {})).toEqual(initialState);
});

test('ADD_ACHIEVEMENT_PROMPT', () => {
  // setup
  const id = 'irrelevant';
  finalState.achievements = [id];
  finalState.show = true;

  // function under test
  const state = promptsReducers.promptsData(initialState, {
    type: types.ADD_ACHIEVEMENT_PROMPT,
    id
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('RESET_ACHIEVEMENT_PROMPTS', () => {
  initialState.achievements = ['irrelevant'];
  const state = promptsReducers.promptsData(initialState, {
    type: types.RESET_ACHIEVEMENT_PROMPTS
  });
  expect(state).toEqual(finalState);
});

test('ADD_BONUS_STREAK_PROMPT', () => {
  finalState.bonusStreak = 1;
  finalState.show = true;
  const state = promptsReducers.promptsData(initialState, {
    type: types.ADD_BONUS_STREAK_PROMPT
  });
  expect(state).toEqual(finalState);
});

test('RESET_BONUS_STREAK_PROMPT', () => {
  initialState.bonusStreak = 1;
  const state = promptsReducers.promptsData(initialState, {
    type: types.RESET_BONUS_STREAK_PROMPT
  });
  expect(state).toEqual(finalState);
});

test('ADD_PRODUCT_PROMPT', () => {
  // setup
  const id = 'irrelevant';
  finalState.products = [id];
  finalState.show = true;

  // function under test
  const state = promptsReducers.promptsData(initialState, {
    type: types.ADD_PRODUCT_PROMPT,
    id
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('RESET_PRODUCT_PROMPT', () => {
  initialState.products = ['irrelevant'];
  const state = promptsReducers.promptsData(initialState, {
    type: types.RESET_PRODUCT_PROMPT
  });
  expect(state).toEqual(finalState);
});

test('ADD_RANK_PROMPT', () => {
  // setup
  const id = 'irrelevant';
  finalState.ranks = [id];
  finalState.show = true;

  // function under test
  const state = promptsReducers.promptsData(initialState, {
    type: types.ADD_RANK_PROMPT,
    id
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('RESET_RANK_PROMPT', () => {
  initialState.ranks = ['irrelevant'];
  const state = promptsReducers.promptsData(initialState, {
    type: types.RESET_RANK_PROMPT
  });
  expect(state).toEqual(finalState);
});

test('ADD_PROMPTS', () => {
  // setup
  const prompts = {
    achievements: ['foo'],
    products: ['foobar'],
    ranks: ['bar']
  };
  finalState.achievements = prompts.achievements;
  finalState.products = prompts.products;
  finalState.ranks = prompts.ranks;
  finalState.show = true;

  // function under test
  const state = promptsReducers.promptsData(initialState, {
    type: types.ADD_PROMPTS,
    prompts
  });

  // expectations
  expect(state).toEqual(finalState);
});

test('SET_PROMPTS_PAUSED', () => {
  // setup
  const paused = true;
  finalState.paused = paused;

  // function under test
  const state = promptsReducers.promptsData(initialState, {
    type: types.SET_PROMPTS_PAUSED,
    paused
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SET_DISPLAY_PROMPTS', () => {
  // setup
  finalState.show = true;

  // function under test
  const state = promptsReducers.promptsData(initialState, {
    type: types.SET_DISPLAY_PROMPTS
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('RESET_DISPLAYED_PROMPTS', () => {
  initialState.show = true;
  const state = promptsReducers.promptsData(initialState, {
    type: types.RESET_DISPLAYED_PROMPTS
  });
  expect(state).toEqual(finalState);
});

test('RESET_PROMPTS', () => {
  const state = promptsReducers.promptsData({}, {
    type: types.RESET_PROMPTS
  });
  expect(state).toEqual(finalState);
});
