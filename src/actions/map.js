import * as types from './mapTypes';

export function setChallenges(challenges) {
  return {
    type: types.SET_CHALLENGES,
    challenges
  };
}

export function setFamilies(families) {
  return {
    type: types.SET_FAMILIES,
    families
  };
}

export function initialiseMapState(initialised) {
  return {
    type: types.MAP_STATE_INITIALISED,
    initialised
  };
}

export function updateChallengeStatus(id, familyId, status) {
  return {
    type: types.UPDATE_CHALLENGE_STATUS,
    id,
    familyId,
    status
  };
}

export function updateFamilyStatus(id, status) {
  return {
    type: types.UPDATE_FAMILY_STATUS,
    id,
    status
  };
}

export function setLastChallengesModified(lastChallengesModified) {
  return {
    type: types.SET_LAST_CHALLENGES_MODIFIED,
    lastChallengesModified
  };
}

export function setLastProductCompleted(lastProductCompleted) {
  return {
    type: types.SET_LAST_PRODUCT_COMPLETED,
    lastProductCompleted
  };
}

export function resetLastProductCompleted() {
  return {
    type: types.RESET_LAST_PRODUCT_COMPLETED
  };
}

export function setCurrentFamilyProduct(currentMap, currentFamily, currentProduct) {
  return {
    type: types.SET_CURRENT_FAMILY_PRODUCT,
    currentMap,
    currentFamily,
    currentProduct
  };
}

export function addPerfectChallenge(challenge) {
  return {
    type: types.ADD_PERFECT_CHALLENGE,
    challenge
  };
}

export function setCompletedProducts(products) {
  return {
    type: types.SET_COMPLETED_PRODUCTS,
    products
  };
}

export function addCompletedProduct(productId) {
  return {
    type: types.ADD_COMPLETED_PRODUCT,
    productId
  };
}

export function setCompletedChallenges(challenges) {
  return {
    type: types.SET_COMPLETED_CHALLENGES,
    challenges
  };
}

export function addCompletedChallenge(challengeId) {
  return {
    type: types.ADD_COMPLETED_CHALLENGE,
    challengeId
  };
}

export function resetProgress() {
  return {
    type: types.RESET_PROGRESS
  };
}

export function setProductPageViewedSession() {
  return {
    type: types.SET_PRODUCT_PAGE_VIEWED_SESSION
  };
}
