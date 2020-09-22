import { createReducer } from 'redux-create-reducer';
import * as types from '../actions/audioTypes';

export const initialState = {
  audioId: ''
};

export const audioData = createReducer(Object.assign(initialState), {
  [types.SET_AUDIO](state, action) {
    return {
      ...state,
      audioId: action.audioId
    };
  },
  [types.SET_PLAY_AUDIO](state, action) {
    return {
      ...state,
      audioId: action.audioId
    };
  },
  [types.PLAY_AUDIO](state) {
    return {
      ...state
    };
  },
  [types.PAUSE_AUDIO](state) {
    return {
      ...state
    };
  },
  [types.STOP_AUDIO](state) {
    return {
      ...state
    };
  }
});

export default { audioData };
