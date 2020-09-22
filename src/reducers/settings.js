import { createReducer } from 'redux-create-reducer';
import * as types from '../actions/settingsTypes';

export const initialState = {
  audio: false,
  tooltips: true
};

export const settingsData = createReducer(Object.assign(initialState), {
  [types.TOGGLE_AUDIO_STATE](state, action) {
    return {
      ...state,
      audio: action.audio
    };
  },
  [types.TOGGLE_TOOLTIPS_STATE](state, action) {
    return {
      ...state,
      tooltips: action.tooltips
    };
  },
  [types.SET_SETTINGS](state, action) {
    return {
      ...state,
      audio: action.settings.audio,
      tooltips: action.settings.tooltips
    };
  }
});

export default { settingsData };
