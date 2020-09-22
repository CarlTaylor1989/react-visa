import { createReducer } from 'redux-create-reducer';
import { cloneDeep } from 'lodash';
import * as types from '../actions/promptTypes';

export const initialState = {
  achievements: [],
  bonusStreak: 0,
  products: [],
  ranks: [],
  show: false,
  paused: false,
  completed: true
};

export const promptsData = createReducer(cloneDeep(initialState), {
  [types.ADD_ACHIEVEMENT_PROMPT](state, action) {
    return {
      ...state,
      achievements: [
        ...state.achievements,
        action.id
      ],
      show: true
    };
  },
  [types.RESET_ACHIEVEMENT_PROMPTS](state) {
    return {
      ...state,
      achievements: []
    };
  },
  [types.ADD_BONUS_STREAK_PROMPT](state) {
    return {
      ...state,
      bonusStreak: 1,
      show: true
    };
  },
  [types.RESET_BONUS_STREAK_PROMPT](state) {
    return {
      ...state,
      bonusStreak: initialState.bonusStreak
    };
  },
  [types.ADD_PRODUCT_PROMPT](state, action) {
    return {
      ...state,
      products: [
        ...state.products,
        action.id
      ],
      show: true
    };
  },
  [types.RESET_PRODUCT_PROMPT](state) {
    return {
      ...state,
      products: []
    };
  },
  [types.ADD_RANK_PROMPT](state, action) {
    return {
      ...state,
      ranks: [
        ...state.ranks,
        action.id
      ],
      show: true
    };
  },
  [types.RESET_RANK_PROMPT](state) {
    return {
      ...state,
      ranks: []
    };
  },
  [types.ADD_PROMPTS](state, action) {
    return {
      ...state,
      achievements: [
        ...state.achievements,
        ...action.prompts.achievements
      ],
      products: [
        ...state.products,
        ...action.prompts.products,
      ],
      ranks: [
        ...state.ranks,
        ...action.prompts.ranks
      ],
      show: true
    };
  },
  [types.SET_PROMPTS_PAUSED](state, action) {
    return {
      ...state,
      paused: action.paused
    };
  },
  [types.SET_DISPLAY_PROMPTS](state) {
    return {
      ...state,
      show: true
    };
  },
  [types.RESET_DISPLAYED_PROMPTS](state) {
    return {
      ...state,
      show: initialState.show
    };
  },
  [types.RESET_PROMPTS]() {
    return cloneDeep(initialState);
  }
});

export default { promptsData };
