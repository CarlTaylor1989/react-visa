import { createReducer } from 'redux-create-reducer';
import * as types from '../actions/tutorialTypes';

export const initialState = {
  slideIndex: 0,
  launched: false
};

export const tutorialData = createReducer(Object.assign(initialState), {
  [types.SET_TUTORIAL_SLIDE_INDEX](state, action) {
    return {
      ...state,
      slideIndex: action.slideIndex
    };
  },
  [types.SET_TUTORIAL_LAUNCHED](state, action) {
    return {
      ...state,
      launched: action.launched
    };
  }
});

export default { tutorialData };
