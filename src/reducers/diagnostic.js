import { createReducer } from 'redux-create-reducer';
import * as types from '../actions/diagnosticTypes';

export const initialState = {
  completed: false,
  region: '',
  visited: false
};

export const diagnosticData = createReducer(Object.assign(initialState), {
  [types.SET_DIAGNOSTIC_COMPLETION](state, action) {
    return {
      ...state,
      completed: action.completed
    };
  },
  [types.SET_DIAGNOSTIC_VISITED](state) {
    return {
      ...state,
      visited: true
    };
  },
  [types.SET_REGION](state, action) {
    return {
      ...state,
      region: action.region
    };
  },
  [types.RESET_DIAGNOSTIC]() {
    return {
      ...initialState
    };
  },
  [types.SET_DIAGNOSTIC_DATA](state, action) {
    return {
      ...state,
      completed: action.data.completed,
      region: action.data.region,
      visited: action.data.visited
    };
  }
});

export default { diagnosticData };
