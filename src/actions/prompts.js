import * as types from './promptTypes';

export function addProductPrompt(id) {
  return {
    type: types.ADD_PRODUCT_PROMPT,
    id
  };
}

export function resetProductPrompt() {
  return {
    type: types.RESET_PRODUCT_PROMPT
  };
}

export function addBonusStreakPrompt() {
  return {
    type: types.ADD_BONUS_STREAK_PROMPT
  };
}

export function resetBonusStreakPrompt() {
  return {
    type: types.RESET_BONUS_STREAK_PROMPT
  };
}

export function addAchievementPrompt(id) {
  return {
    type: types.ADD_ACHIEVEMENT_PROMPT,
    id
  };
}

export function resetAchievementPrompts() {
  return {
    type: types.RESET_ACHIEVEMENT_PROMPTS
  };
}

export function addRankPrompt(id) {
  return {
    type: types.ADD_RANK_PROMPT,
    id
  };
}

export function resetRankPrompt() {
  return {
    type: types.RESET_RANK_PROMPT
  };
}

export function addPrompts(prompts) {
  return {
    type: types.ADD_PROMPTS,
    prompts
  };
}

export function setPromptsPaused(paused) {
  return {
    type: types.SET_PROMPTS_PAUSED,
    paused
  };
}

export function setDisplayPrompts() {
  return {
    type: types.SET_DISPLAY_PROMPTS
  };
}

export function resetDisplayedPrompts() {
  return {
    type: types.RESET_DISPLAYED_PROMPTS
  };
}

export function resetPrompts() {
  return {
    type: types.RESET_PROMPTS
  };
}
