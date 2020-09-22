import * as actions from '../../actions/map';
import * as types from '../../actions/mapTypes';

test('method setChallenges()', () => {
  const challenges = [{
    id: 'c1',
    productId: 'p1',
    familyId: 'f1'
  }];
  const output = actions.setChallenges(challenges);
  expect(output).toEqual({
    type: types.SET_CHALLENGES,
    challenges
  });
});

test('method setFamilies()', () => {
  const families = [{
    id: 'f1',
    status: 0
  }];
  const output = actions.setFamilies(families);
  expect(output).toEqual({
    type: types.SET_FAMILIES,
    families
  });
});

test('method initialiseMapState()', () => {
  const initialised = true;
  const output = actions.initialiseMapState(initialised);
  expect(output).toEqual({
    type: types.MAP_STATE_INITIALISED,
    initialised
  });
});

test('method updateChallengeStatus()', () => {
  // setup
  const id = 'c0';
  const familyId = 'f0';
  const status = 2;

  // function under test
  const output = actions.updateChallengeStatus(id, familyId, status);

  // expectations
  expect(output).toEqual({
    type: types.UPDATE_CHALLENGE_STATUS,
    id,
    familyId,
    status
  });
});

test('method updateFamilyStatus()', () => {
  // setup
  const id = 'f0';
  const status = 1;

  const output = actions.updateFamilyStatus(id, status);
  expect(output).toEqual({
    type: types.UPDATE_FAMILY_STATUS,
    id,
    status
  });
});

test('method setLastChallengesModified()', () => {
  const lastChallengesModified = ['c1'];
  const output = actions.setLastChallengesModified(lastChallengesModified);
  expect(output).toEqual({
    type: types.SET_LAST_CHALLENGES_MODIFIED,
    lastChallengesModified
  });
});

test('method setLastProductCompleted()', () => {
  const lastProductCompleted = 'product';
  const output = actions.setLastProductCompleted(lastProductCompleted);
  expect(output).toEqual({
    type: types.SET_LAST_PRODUCT_COMPLETED,
    lastProductCompleted
  });
});

test('method resetLastProductCompleted()', () => {
  const output = actions.resetLastProductCompleted();
  expect(output).toEqual({
    type: types.RESET_LAST_PRODUCT_COMPLETED
  });
});

test('method setCurrentFamilyProduct()', () => {
  // setup
  const currentMap = 'm1';
  const currentFamily = 'm1f2';
  const currentProduct = 'p4';

  // function under test
  const output = actions.setCurrentFamilyProduct(currentMap, currentFamily, currentProduct);

  // expectations
  expect(output).toEqual({
    type: types.SET_CURRENT_FAMILY_PRODUCT,
    currentMap,
    currentFamily,
    currentProduct
  });
});

test('method addPerfectChallenge()', () => {
  const challenge = 'irrelevant';
  const output = actions.addPerfectChallenge(challenge);
  expect(output).toEqual({
    type: types.ADD_PERFECT_CHALLENGE,
    challenge
  });
});

test('method setCompletedProducts()', () => {
  const products = ['foo', 'bar'];
  const output = actions.setCompletedProducts(products);
  expect(output).toEqual({
    type: types.SET_COMPLETED_PRODUCTS,
    products
  });
});

test('method addCompletedProduct()', () => {
  const productId = 'irrelevant';
  const output = actions.addCompletedProduct(productId);
  expect(output).toEqual({
    type: types.ADD_COMPLETED_PRODUCT,
    productId
  });
});

test('method setCompletedChallenges()', () => {
  const challenges = ['foo', 'bar'];
  const output = actions.setCompletedChallenges(challenges);
  expect(output).toEqual({
    type: types.SET_COMPLETED_CHALLENGES,
    challenges
  });
});

test('method addCompletedChallenge()', () => {
  const challengeId = 'irrelevant';
  const output = actions.addCompletedChallenge(challengeId);
  expect(output).toEqual({
    type: types.ADD_COMPLETED_CHALLENGE,
    challengeId
  });
});

test('method resetProgress()', () => {
  const output = actions.resetProgress();
  expect(output).toEqual({
    type: types.RESET_PROGRESS
  });
});

test('method setProductPageViewedSession()', () => {
  const output = actions.setProductPageViewedSession();
  expect(output).toEqual({
    type: types.SET_PRODUCT_PAGE_VIEWED_SESSION
  });
});
