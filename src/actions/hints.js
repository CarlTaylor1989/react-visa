import * as types from './hintsTypes';

export function setCurrentHintGroup(group) {
  return {
    type: types.SET_CURRENT_HINT_GROUP,
    group
  };
}

export function setHintGroupIndex(hints) {
  return {
    type: types.SET_HINT_GROUP_INDEX,
    hints
  };
}

export function setHintsPaused(paused) {
  return {
    type: types.SET_HINTS_PAUSED,
    paused
  };
}
