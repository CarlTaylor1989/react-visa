import * as types from './achievementTypes';

export function setCompletedAchievement(achievement) {
  return {
    type: types.SET_COMPLETED_ACHIEVEMENT,
    achievement
  };
}

export function restoreAchievements(completed, lastCompleted) {
  return {
    type: types.RESTORE_ACHIEVEMENTS,
    completed,
    lastCompleted
  };
}

export function updateProductAchievements() {
  return {
    type: types.UPDATE_PRODUCT_ACHIEVEMENTS
  };
}

export function updateProposalAchievements() {
  return {
    type: types.UPDATE_PROPOSAL_ACHIEVEMENTS
  };
}

export function updateScoredAchievements() {
  return {
    type: types.UPDATE_SCORED_ACHIEVEMENTS
  };
}

export function updateSettingsAchievements() {
  return {
    type: types.UPDATE_SETTINGS_ACHIEVEMENTS
  };
}

export function updateTimedAchievements() {
  return {
    type: types.UPDATE_TIMED_ACHIEVEMENTS
  };
}

export function resetChangedAchievement() {
  return {
    type: types.RESET_CHANGED_ACHIEVEMENT
  };
}

export function resetAchievements() {
  return {
    type: types.RESET_ACHIEVEMENTS
  };
}
