import * as actions from '../../actions/score';
import * as types from '../../actions/scoreTypes';

test('method setTotalScore()', () => {
  const score = 1000;
  const output = actions.setTotalScore(1000);
  expect(output).toEqual({
    type: types.SET_TOTAL_SCORE,
    score
  });
});

test('method setDisplayedScore()', () => {
  const output = actions.setDisplayedScore();
  expect(output).toEqual({
    type: types.SET_DISPLAYED_SCORE
  });
});

test('method updateDisplayedScore()', () => {
  const output = actions.updateDisplayedScore();
  expect(output).toEqual({
    type: types.UPDATE_DISPLAYED_SCORE
  });
});

test('method setRunningScore()', () => {
  const score = 1000;
  const output = actions.setRunningScore(score);
  expect(output).toEqual({
    type: types.SET_RUNNING_SCORE,
    score
  });
});

test('method setRank()', () => {
  const rank = 'irrelevant';
  const output = actions.setRank(rank);
  expect(output).toEqual({
    type: types.SET_RANK,
    rank
  });
});

test('method setScores()', () => {
  const running = 1000;
  const total = 10000;
  const output = actions.setScores(running, total);
  expect(output).toEqual({
    type: types.SET_SCORES,
    running,
    total
  });
});

test('method increaseScore()', () => {
  const score = 1000;
  const output = actions.increaseScore(1000);
  expect(output).toEqual({
    type: types.INCREASE_SCORE,
    score
  });
});

test('method decreaseScore()', () => {
  const score = 1000;
  const output = actions.decreaseScore(score);
  expect(output).toEqual({
    type: types.DECREASE_SCORE,
    score
  });
});

test('method setCategories()', () => {
  const categories = { foo: 1 };
  const output = actions.setCategories(categories);
  expect(output).toEqual({
    type: types.SET_CATEGORIES,
    categories
  });
});

test('method increaseChallengesCompleted()', () => {
  const output = actions.increaseChallengesCompleted();
  expect(output).toEqual({
    type: types.INCREASE_CHALLENGES_COMPLETED
  });
});

test('method increasePerfectBonus()', () => {
  const output = actions.increasePerfectBonus();
  expect(output).toEqual({
    type: types.INCREASE_PERFECT_BONUS
  });
});

test('method increaseStreakBonus()', () => {
  const output = actions.increaseStreakBonus();
  expect(output).toEqual({
    type: types.INCREASE_STREAK_BONUS
  });
});

test('method increaseProductsCompleted()', () => {
  const output = actions.increaseProductsCompleted();
  expect(output).toEqual({
    type: types.INCREASE_PRODUCTS_COMPLETED
  });
});

test('method increaseClientNeeds()', () => {
  const output = actions.increaseClientNeeds();
  expect(output).toEqual({
    type: types.INCREASE_CLIENT_NEEDS
  });
});

test('method increaseProposalsCompleted()', () => {
  const output = actions.increaseProposalsCompleted();
  expect(output).toEqual({
    type: types.INCREASE_PROPOSALS_COMPLETED
  });
});

test('method increaseAchievementsUnlocked()', () => {
  const output = actions.increaseAchievementsUnlocked();
  expect(output).toEqual({
    type: types.INCREASE_ACHIEVEMENTS_UNLOCKED
  });
});

test('method resetRunningCategories()', () => {
  const output = actions.resetRunningCategories();
  expect(output).toEqual({
    type: types.RESET_RUNNING_CATEGORIES
  });
});

test('method resetAllScores()', () => {
  const output = actions.resetAllScores();
  expect(output).toEqual({
    type: types.RESET_ALL_SCORES
  });
});
