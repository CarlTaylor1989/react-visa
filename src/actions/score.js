import * as types from './scoreTypes';

export function setTotalScore(score) {
  return {
    type: types.SET_TOTAL_SCORE,
    score
  };
}

export function setDisplayedScore() {
  return {
    type: types.SET_DISPLAYED_SCORE
  };
}

export function updateDisplayedScore() {
  return {
    type: types.UPDATE_DISPLAYED_SCORE
  };
}

export function setRunningScore(score) {
  return {
    type: types.SET_RUNNING_SCORE,
    score
  };
}

export function setRank(rank) {
  return {
    type: types.SET_RANK,
    rank
  };
}

export function setScores(running, total) {
  return {
    type: types.SET_SCORES,
    running,
    total
  };
}

export function increaseScore(score) {
  return {
    type: types.INCREASE_SCORE,
    score
  };
}

export function decreaseScore(score) {
  return {
    type: types.DECREASE_SCORE,
    score
  };
}

export function setCategories(categories) {
  return {
    type: types.SET_CATEGORIES,
    categories
  };
}

export function increaseChallengesCompleted() {
  return {
    type: types.INCREASE_CHALLENGES_COMPLETED
  };
}

export function increasePerfectBonus() {
  return {
    type: types.INCREASE_PERFECT_BONUS
  };
}

export function increaseStreakBonus() {
  return {
    type: types.INCREASE_STREAK_BONUS
  };
}

export function increaseClientNeeds() {
  return {
    type: types.INCREASE_CLIENT_NEEDS
  };
}

export function increaseProductsCompleted() {
  return {
    type: types.INCREASE_PRODUCTS_COMPLETED
  };
}

export function increaseProposalsCompleted() {
  return {
    type: types.INCREASE_PROPOSALS_COMPLETED
  };
}

export function increaseAchievementsUnlocked() {
  return {
    type: types.INCREASE_ACHIEVEMENTS_UNLOCKED
  };
}

export function resetRunningCategories() {
  return {
    type: types.RESET_RUNNING_CATEGORIES
  };
}

export function resetAllScores() {
  return {
    type: types.RESET_ALL_SCORES
  };
}
