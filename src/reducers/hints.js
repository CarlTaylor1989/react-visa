import { createReducer } from 'redux-create-reducer';
import * as types from '../actions/hintsTypes';
import * as lib from '../config/hints';

export const initialState = {
  currentGroup: '',
  paused: false,
  hints: [
    { group: lib.HINT_DIAGNOSTIC, index: 0 },
    { group: lib.HINT_NETWORK, index: 0 },
    { group: lib.HINT_PRODUCT, index: 0 },
    { group: lib.HINT_CLIENT_SELECTION, index: 0 },
    { group: lib.HINT_CLIENT_PROPOSAL, index: 0 }
  ]
};

export const hintsData = createReducer(Object.assign(initialState), {
  [types.SET_CURRENT_HINT_GROUP](state, action) {
    return {
      ...state,
      currentGroup: action.group
    };
  },
  [types.SET_HINT_GROUP_INDEX](state, action) {
    return {
      ...state,
      hints: state.hints.map(hint => (
        hint.group === action.hints.group ? {
          ...hint,
          index: action.hints.index
        } : hint))
    };
  },
  [types.SET_HINTS_PAUSED](state, action) {
    return {
      ...state,
      paused: action.paused
    };
  }
});

export default { hintsData };
