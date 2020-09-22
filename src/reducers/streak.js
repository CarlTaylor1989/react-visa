import { createReducer } from 'redux-create-reducer';
import * as types from '../actions/streakTypes';
import { ACTIVATE_STREAK_AFTER, MAXIMUM_STREAK } from '../config/constants';

export const initialState = {
  active: true,
  completed: false,
  lastCompleted: new Date(2019, 6, 1).getTime(),
  progress: 0,
  tutorialCriteriaMet: false
};

export const checkStreakStatus = (state) => {
  let updatedState = {};
  if (state && !state.active && state.completed) {
    // Get the hours difference between two dates
    const diff = Math.abs(new Date().getTime() - state.lastCompleted) / 3600000;
    updatedState = {
      active: diff >= ACTIVATE_STREAK_AFTER ? initialState.active : state.active,
      completed: diff >= ACTIVATE_STREAK_AFTER ? initialState.completed : state.completed,
      progress: diff >= ACTIVATE_STREAK_AFTER ? initialState.progress : state.progress
    };
  }
  return {
    ...state,
    ...updatedState
  };
};

export const streakData = createReducer(Object.assign(initialState), {
  [types.INCREASE_STREAK](state) {
    const updatedState = checkStreakStatus(state);
    const canUpdateProgress = updatedState.active && updatedState.progress < MAXIMUM_STREAK;
    const newProgress = updatedState.progress + 1;
    const canUpdateCompletion = canUpdateProgress && newProgress === MAXIMUM_STREAK;
    return {
      ...state,
      active: canUpdateCompletion ? false : updatedState.active,
      completed: canUpdateCompletion ? true : updatedState.completed,
      lastCompleted: canUpdateCompletion ? new Date().getTime() : updatedState.lastCompleted,
      progress: canUpdateProgress ? newProgress : updatedState.progress
    };
  },
  [types.SET_STREAK](state, action) {
    const updatedState = checkStreakStatus(action.data);
    return {
      ...state,
      ...updatedState
    };
  },
  [types.RESET_STREAK_PROGRESS](state) {
    const updatedState = checkStreakStatus(state);
    return {
      ...state,
      progress: updatedState.active ? 0 : updatedState.progress
    };
  },
  [types.CHECK_STREAK_STATUS](state) {
    return {
      ...state,
      ...checkStreakStatus(state)
    };
  }
});

export default { streakData };
