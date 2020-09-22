import * as types from './streakTypes';

export function increaseStreak() {
  return {
    type: types.INCREASE_STREAK
  };
}

export function setStreak(data) {
  return {
    type: types.SET_STREAK,
    data
  };
}

export function resetStreakProgress(challengeId, familyId) {
  return {
    type: types.RESET_STREAK_PROGRESS,
    challengeId,
    familyId
  };
}

export function checkStreakStatus() {
  return {
    type: types.CHECK_STREAK_STATUS
  };
}
