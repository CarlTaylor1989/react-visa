import * as actions from '../../actions/achievements';
import * as types from '../../actions/achievementTypes';

test('method setCompletedAchievement()', () => {
  const achievement = 'irrelevant';
  const output = actions.setCompletedAchievement(achievement);
  expect(output).toEqual({
    type: types.SET_COMPLETED_ACHIEVEMENT,
    achievement
  });
});

test('method restoreAchievements()', () => {
  const completed = ['foo', 'bar'];
  const lastCompleted = 'foo';
  const output = actions.restoreAchievements(completed, lastCompleted);
  expect(output).toEqual({
    type: types.RESTORE_ACHIEVEMENTS,
    completed,
    lastCompleted
  });
});

test('method updateProductAchievements()', () => {
  const output = actions.updateProductAchievements();
  expect(output).toEqual({
    type: types.UPDATE_PRODUCT_ACHIEVEMENTS
  });
});

test('method updateProposalAchievements()', () => {
  const output = actions.updateProposalAchievements();
  expect(output).toEqual({
    type: types.UPDATE_PROPOSAL_ACHIEVEMENTS
  });
});

test('method updateScoredAchievements()', () => {
  const output = actions.updateScoredAchievements();
  expect(output).toEqual({
    type: types.UPDATE_SCORED_ACHIEVEMENTS
  });
});

test('method updateSettingsAchievements()', () => {
  const output = actions.updateSettingsAchievements();
  expect(output).toEqual({
    type: types.UPDATE_SETTINGS_ACHIEVEMENTS
  });
});

test('method updateTimedAchievements()', () => {
  const output = actions.updateTimedAchievements();
  expect(output).toEqual({
    type: types.UPDATE_TIMED_ACHIEVEMENTS
  });
});

test('method resetChangedAchievement()', () => {
  const output = actions.resetChangedAchievement();
  expect(output).toEqual({
    type: types.RESET_CHANGED_ACHIEVEMENT
  });
});

test('method resetAchievements()', () => {
  const output = actions.resetAchievements();
  expect(output).toEqual({
    type: types.RESET_ACHIEVEMENTS
  });
});
