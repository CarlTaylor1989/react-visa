import { createReducer } from 'redux-create-reducer';
import { cloneDeep } from 'lodash';
import * as types from '../actions/mapTypes';

export const initialState = {
  challenges: [],
  families: [],
  initialised: false,
  lastChallengesModified: [],
  lastProductCompleted: '',
  lastProductModified: '',
  perfect: [],
  currentMap: '',
  currentFamily: '',
  currentProduct: '',
  completedProducts: [],
  completedChallenges: [],
  completedChallengesSession: false,
  completedProductsSession: false,
  productPageViewedSession: false
};

export const mapData = createReducer(cloneDeep(initialState), {
  [types.SET_CHALLENGES](state, action) {
    return {
      ...state,
      challenges: [
        ...state.challenges,
        ...action.challenges
      ]
    };
  },
  [types.SET_FAMILIES](state, action) {
    return {
      ...state,
      families: [
        ...state.families,
        ...action.families
      ]
    };
  },
  [types.MAP_STATE_INITIALISED](state, action) {
    return {
      ...state,
      initialised: action.initialised
    };
  },
  [types.UPDATE_CHALLENGE_STATUS](state, action) {
    return {
      ...state,
      challenges: state.challenges.map(challenge => (
        challenge.id === action.id
        && challenge.familyId === action.familyId ? {
            ...challenge,
            status: challenge.status < action.status ? action.status : challenge.status
          } : challenge))
    };
  },
  [types.UPDATE_FAMILY_STATUS](state, action) {
    return {
      ...state,
      families: state.families.map(family => (
        family.id === action.id ? {
          ...family,
          status: action.status
        } : family))
    };
  },
  [types.SET_LAST_CHALLENGES_MODIFIED](state, action) {
    return {
      ...state,
      lastChallengesModified: action.lastChallengesModified
    };
  },
  [types.SET_LAST_PRODUCT_COMPLETED](state, action) {
    return {
      ...state,
      lastProductCompleted: action.lastProductCompleted
    };
  },
  [types.RESET_LAST_PRODUCT_COMPLETED](state) {
    return {
      ...state,
      lastProductCompleted: initialState.lastProductCompleted
    };
  },
  [types.SET_CURRENT_FAMILY_PRODUCT](state, action) {
    return {
      ...state,
      currentMap: action.currentMap,
      currentFamily: action.currentFamily,
      currentProduct: action.currentProduct
    };
  },
  [types.ADD_PERFECT_CHALLENGE](state, action) {
    if (!state.perfect.includes(action.challenge)) {
      return {
        ...state,
        perfect: [
          ...state.perfect,
          action.challenge
        ]
      };
    }
    return {
      ...state
    };
  },
  [types.SET_COMPLETED_PRODUCTS](state, action) {
    return {
      ...state,
      completedProducts: [
        ...state.completedProducts,
        ...action.products
      ]
    };
  },
  [types.ADD_COMPLETED_PRODUCT](state, action) {
    return {
      ...state,
      completedProducts: [
        ...state.completedProducts,
        action.productId
      ],
      completedProductsSession: true
    };
  },
  [types.SET_COMPLETED_CHALLENGES](state, action) {
    return {
      ...state,
      completedChallenges: [
        ...state.completedChallenges,
        ...action.challenges
      ]
    };
  },
  [types.ADD_COMPLETED_CHALLENGE](state, action) {
    return {
      ...state,
      completedChallenges: [
        ...state.completedChallenges,
        action.challengeId
      ],
      completedChallengesSession: true
    };
  },
  [types.RESET_PROGRESS]() {
    return cloneDeep(initialState);
  },
  [types.SET_PRODUCT_PAGE_VIEWED_SESSION](state) {
    return {
      ...state,
      productPageViewedSession: true
    };
  }
});

export default { mapData };
