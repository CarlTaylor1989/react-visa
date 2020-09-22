import { createReducer } from 'redux-create-reducer';
import { cloneDeep } from 'lodash';
import * as types from '../actions/scoreTypes';
import { defaultRank } from '../config/ranks';
import { getRankId } from '../lib/ranks';

export const initialState = {
  total: 0,
  scoreToDisplay: 0,
  displayedScore: 0,
  running: 0,
  categories: {
    challenges: 0,
    clientNeeds: 0,
    perfectBonus: 0,
    streakBonus: 0,
    products: 0,
    proposals: 0,
    achievements: 0
  },
  rank: defaultRank,
  rankIncreaseSession: false
};

export const scoreData = createReducer(cloneDeep(initialState), {
  [types.SET_TOTAL_SCORE](state, action) {
    return {
      ...state,
      total: action.score,
      scoreToDisplay: action.score,
      displayedScore: action.score,
      rank: getRankId(action.score)
    };
  },
  [types.SET_DISPLAYED_SCORE](state) {
    return {
      ...state,
      displayedScore: state.scoreToDisplay,
      scoreToDisplay: state.total,
    };
  },
  [types.UPDATE_DISPLAYED_SCORE](state) {
    return {
      ...state,
      displayedScore: state.total
    };
  },
  [types.SET_RUNNING_SCORE](state, action) {
    return {
      ...state,
      running: action.score
    };
  },
  [types.SET_RANK](state, action) {
    return {
      ...state,
      rank: action.rank
    };
  },
  [types.SET_SCORES](state, action) {
    return {
      ...state,
      running: action.running,
      total: action.total,
      displayedScore: action.total,
      scoreToDisplay: action.total
    };
  },
  [types.INCREASE_SCORE](state, action) {
    const total = state.total + action.score;
    const newRank = getRankId(total);
    return {
      ...state,
      running: state.running + action.score,
      total,
      rank: newRank,
      rankIncreaseSession: (newRank !== state.rank) ? true : state.rankIncreaseSession
    };
  },
  [types.DECREASE_SCORE](state, action) {
    const total = state.total - action.score;
    return {
      ...state,
      running: state.running - action.score,
      total,
      rank: getRankId(total)
    };
  },
  [types.SET_CATEGORIES](state, action) {
    return {
      ...state,
      categories: {
        ...state.categories,
        ...action.categories
      }
    };
  },
  [types.INCREASE_CHALLENGES_COMPLETED](state) {
    return {
      ...state,
      categories: {
        ...state.categories,
        challenges: state.categories.challenges + 1
      }
    };
  },
  [types.INCREASE_PERFECT_BONUS](state) {
    return {
      ...state,
      categories: {
        ...state.categories,
        perfectBonus: state.categories.perfectBonus + 1
      }
    };
  },
  [types.INCREASE_STREAK_BONUS](state) {
    return {
      ...state,
      categories: {
        ...state.categories,
        streakBonus: state.categories.streakBonus + 1
      }
    };
  },
  [types.INCREASE_PRODUCTS_COMPLETED](state) {
    return {
      ...state,
      categories: {
        ...state.categories,
        products: state.categories.products + 1
      }
    };
  },
  [types.INCREASE_CLIENT_NEEDS](state) {
    return {
      ...state,
      categories: {
        ...state.categories,
        clientNeeds: state.categories.clientNeeds + 1
      }
    };
  },
  [types.INCREASE_PROPOSALS_COMPLETED](state) {
    return {
      ...state,
      categories: {
        ...state.categories,
        proposals: state.categories.proposals + 1
      }
    };
  },
  [types.INCREASE_ACHIEVEMENTS_UNLOCKED](state) {
    return {
      ...state,
      categories: {
        ...state.categories,
        achievements: state.categories.achievements + 1
      }
    };
  },
  [types.RESET_RUNNING_CATEGORIES](state) {
    return {
      ...state,
      running: initialState.running,
      categories: {
        ...initialState.categories
      }
    };
  },
  [types.RESET_ALL_SCORES]() {
    return {
      total: initialState.total,
      displayedScore: initialState.displayedScore,
      scoreToDisplay: initialState.scoreToDisplay,
      running: initialState.running,
      rank: initialState.rank,
      categories: {
        ...initialState.categories
      },
      rankIncreaseSession: initialState.rankIncreaseSession
    };
  }
});

export default { scoreData };
