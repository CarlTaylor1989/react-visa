import * as types from '../actions/mapTypes';
import * as mapActions from '../actions/map';
import * as promptActions from '../actions/prompts';
import {
  CHALLENGE_COMPLETION_STATUS,
  CHALLENGE_PERFECT_STATUS
} from '../config/constants';

export const setCompletedChallenges = ({ dispatch, getState }) => next => (action) => {
  if (action.type === types.UPDATE_CHALLENGE_STATUS
    && (action.status === CHALLENGE_COMPLETION_STATUS
      || action.status === CHALLENGE_PERFECT_STATUS)) {
    const mapData = getState().mapData;
    const challengeId = action.familyId + action.id;
    if (!mapData.completedChallenges.includes(challengeId)) {
      dispatch(mapActions.addCompletedChallenge(challengeId));
    }
  }

  if (action.type === types.SET_CHALLENGES) {
    const completedChallenges = action.challenges.filter(ch => (
      ch.status === CHALLENGE_COMPLETION_STATUS || ch.status === CHALLENGE_PERFECT_STATUS));
    const completedChallengeIds = completedChallenges.map(ch => ch.familyId + ch.id);
    dispatch(mapActions.setCompletedChallenges(completedChallengeIds));

    completedChallenges.filter(ch => ch.status === CHALLENGE_PERFECT_STATUS).forEach((ch) => {
      dispatch(mapActions.addPerfectChallenge(ch.familyId + ch.id));
    });
  }

  next(action);
};

export const setCompletedProducts = ({ dispatch, getState }) => next => (action) => {
  const updatedAction = action;

  if (action.type === types.SET_LAST_PRODUCT_COMPLETED) {
    const mapData = getState().mapData;
    const productId = mapData.currentFamily + action.lastProductCompleted;
    if (!mapData.completedProducts.includes(productId)) {
      dispatch(mapActions.addCompletedProduct(productId));
      dispatch(promptActions.addProductPrompt(action.lastProductCompleted));
    } else {
      updatedAction.lastProductCompleted = '';
    }
  }

  if (action.type === types.SET_CHALLENGES) {
    const completedProducts = action.challenges.filter(ch => (
      ch.isFinal
      && (ch.status === CHALLENGE_COMPLETION_STATUS || ch.status === CHALLENGE_PERFECT_STATUS)));
    const completedProductsIds = completedProducts.map(ch => ch.familyId + ch.productId);
    dispatch(mapActions.setCompletedProducts(completedProductsIds));
  }

  next(updatedAction);
};

export const perfectChallenge = ({ dispatch }) => next => (action) => {
  if (action.type === types.UPDATE_CHALLENGE_STATUS && action.status === CHALLENGE_PERFECT_STATUS) {
    dispatch(mapActions.addPerfectChallenge(action.familyId + action.id));
  }

  next(action);
};

export default [
  setCompletedChallenges,
  setCompletedProducts,
  perfectChallenge
];
