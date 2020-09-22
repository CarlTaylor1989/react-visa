import { createReducer } from 'redux-create-reducer';
import { cloneDeep } from 'lodash';
import * as types from '../actions/achievementTypes';

export const initialState = {
  completed: [],
  lastCompleted: '',
  completedThisSession: false,
  achievementChanged: false
};

export const achievementsData = createReducer(cloneDeep(initialState), {
  [types.SET_COMPLETED_ACHIEVEMENT](state, action) {
    const exists = state.completed.includes(action.achievement);
    return {
      ...state,
      completed: exists ? state.completed : [
        ...state.completed,
        action.achievement
      ],
      achievementChanged: exists ? state.achievementChanged : true,
      lastCompleted: exists ? state.lastCompleted : action.achievement,
      completedThisSession: exists ? state.completedThisSession : true
    };
  },
  [types.RESTORE_ACHIEVEMENTS](state, action) {
    return {
      ...state,
      completed: [
        ...action.completed
      ],
      lastCompleted: action.lastCompleted
    };
  },
  [types.RESET_CHANGED_ACHIEVEMENT](state) {
    return {
      ...state,
      achievementChanged: initialState.achievementChanged
    };
  },
  [types.RESET_ACHIEVEMENTS]() {
    return cloneDeep(initialState);
  }
});

export default { achievementsData };
