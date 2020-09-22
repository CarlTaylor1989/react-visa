import * as actions from '../../actions/prompts';
import * as types from '../../actions/promptTypes';

test('method addProductPrompt()', () => {
  const id = 'm1f1p1';
  const output = actions.addProductPrompt(id);
  expect(output).toEqual({
    type: types.ADD_PRODUCT_PROMPT,
    id
  });
});

test('method resetProductPrompt()', () => {
  const output = actions.resetProductPrompt();
  expect(output).toEqual({
    type: types.RESET_PRODUCT_PROMPT
  });
});

test('method addBonusStreakPrompt()', () => {
  const output = actions.addBonusStreakPrompt();
  expect(output).toEqual({
    type: types.ADD_BONUS_STREAK_PROMPT
  });
});

test('method resetBonusStreakPrompt()', () => {
  const output = actions.resetBonusStreakPrompt();
  expect(output).toEqual({
    type: types.RESET_BONUS_STREAK_PROMPT
  });
});

test('method addAchievementPrompt()', () => {
  const id = 'ac1';
  const output = actions.addAchievementPrompt(id);
  expect(output).toEqual({
    type: types.ADD_ACHIEVEMENT_PROMPT,
    id
  });
});

test('method resetAchievementPrompts()', () => {
  const output = actions.resetAchievementPrompts();
  expect(output).toEqual({
    type: types.RESET_ACHIEVEMENT_PROMPTS
  });
});

test('method addRankPrompt()', () => {
  const id = 'r1';
  const output = actions.addRankPrompt(id);
  expect(output).toEqual({
    type: types.ADD_RANK_PROMPT,
    id
  });
});

test('method resetRankPrompt()', () => {
  const output = actions.resetRankPrompt();
  expect(output).toEqual({
    type: types.RESET_RANK_PROMPT
  });
});

test('method addPrompts()', () => {
  const prompts = { foo: [], bar: [] };
  const output = actions.addPrompts(prompts);
  expect(output).toEqual({
    type: types.ADD_PROMPTS,
    prompts
  });
});

test('method setPromptsPaused()', () => {
  const paused = true;
  const output = actions.setPromptsPaused(paused);
  expect(output).toEqual({
    type: types.SET_PROMPTS_PAUSED,
    paused
  });
});

test('method setDisplayPrompts()', () => {
  const output = actions.setDisplayPrompts();
  expect(output).toEqual({
    type: types.SET_DISPLAY_PROMPTS
  });
});

test('method resetDisplayedPrompts()', () => {
  const output = actions.resetDisplayedPrompts();
  expect(output).toEqual({
    type: types.RESET_DISPLAYED_PROMPTS
  });
});

test('method resetPrompts()', () => {
  const output = actions.resetPrompts();
  expect(output).toEqual({
    type: types.RESET_PROMPTS
  });
});
