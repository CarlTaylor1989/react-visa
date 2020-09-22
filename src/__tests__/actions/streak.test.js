import * as actions from '../../actions/streak';
import * as types from '../../actions/streakTypes';

test('method increaseStreak()', () => {
  const output = actions.increaseStreak();
  expect(output).toEqual({
    type: types.INCREASE_STREAK
  });
});

test('method setStreak()', () => {
  const data = { foo: 'bar' };
  const output = actions.setStreak(data);
  expect(output).toEqual({
    type: types.SET_STREAK,
    data
  });
});

test('method resetStreakProgress()', () => {
  const challengeId = 'foo';
  const familyId = 'foo';
  const output = actions.resetStreakProgress(challengeId, familyId);
  expect(output).toEqual({
    type: types.RESET_STREAK_PROGRESS,
    challengeId,
    familyId
  });
});

test('method checkStreakStatus()', () => {
  const output = actions.checkStreakStatus();
  expect(output).toEqual({
    type: types.CHECK_STREAK_STATUS
  });
});
