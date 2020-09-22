import * as types from '../../actions/mapTypes';
import * as mapReducer from '../../reducers/map';

let initialState;
let finalState;
beforeEach(() => {
  initialState = {
    ...mapReducer.initialState
  };
  finalState = {
    ...initialState
  };
});

test('return the initial state', () => {
  expect(mapReducer.mapData(undefined, {})).toEqual(initialState);
});

test('SET_CHALLENGES', () => {
  // setup
  const challenges = [{
    id: 'c1',
    productId: 'p1'
  }];
  finalState.challenges = [...challenges];

  // function under test
  const state = mapReducer.mapData(initialState, {
    type: types.SET_CHALLENGES,
    challenges
  });

  // expectations
  expect(state).toEqual(finalState);
});

test('SET_FAMILIES', () => {
  // setup
  const families = [{
    id: 'f1',
    status: 0
  }];
  finalState.families = [...families];

  // function under test
  const state = mapReducer.mapData(initialState, {
    type: types.SET_FAMILIES,
    families
  });

  // expectations
  expect(state).toEqual(finalState);
});

test('MAP_STATE_INITIALISED', () => {
  // setup
  const initialised = true;
  finalState.initialised = initialised;

  // function under test
  const state = mapReducer.mapData(initialState, {
    type: types.MAP_STATE_INITIALISED,
    initialised
  });

  // expectations
  expect(state).toEqual(finalState);
});

describe('UPDATE_CHALLENGE_STATUS', () => {
  test('challenge not found', () => {
    // setup
    const challenge = {
      id: 'c10',
      productId: 'p1',
      familyId: 'f1',
      status: 1
    };
    initialState.challenges = [{
      id: 'c1',
      productId: 'p1'
    }];
    finalState.challenges = [...initialState.challenges];

    // function under test
    const state = mapReducer.mapData(initialState, {
      type: types.UPDATE_CHALLENGE_STATUS,
      ...challenge
    });

    // expectations
    expect(state).toEqual(finalState);
  });

  test('challenge found and status updated', () => {
    // setup
    const challenge = {
      id: 'c1',
      productId: 'p1',
      familyId: 'f1',
      status: 3
    };
    initialState.challenges = [{
      id: 'c1',
      productId: 'p1',
      familyId: 'f1',
      status: 1
    }];
    finalState.challenges = [challenge];

    // function under test
    const state = mapReducer.mapData(initialState, {
      type: types.UPDATE_CHALLENGE_STATUS,
      ...challenge
    });

    // expectations
    expect(state).toEqual(finalState);
  });

  test('challenge found and status not updated', () => {
    // setup
    const initialChallege = {
      id: 'c1',
      productId: 'p1',
      familyId: 'f1',
      status: 4
    };
    const challenge = {
      id: 'c1',
      productId: 'p1',
      familyId: 'f1',
      status: 3
    };
    initialState.challenges = [initialChallege];
    finalState.challenges = [initialChallege];

    // function under test
    const state = mapReducer.mapData(initialState, {
      type: types.UPDATE_CHALLENGE_STATUS,
      ...challenge,
    });

    // expectations
    expect(state).toEqual(finalState);
  });
});

describe('UPDATE_FAMILY_STATUS', () => {
  test('family not found', () => {
    // setup
    const family = {
      id: 'f10',
      status: 1
    };
    initialState.families = [{
      id: 'f1'
    }];
    finalState.families = [...initialState.families];

    // function under test
    const state = mapReducer.mapData(initialState, {
      type: types.UPDATE_FAMILY_STATUS,
      ...family
    });

    // expectations
    expect(state).toEqual(finalState);
  });

  test('family found', () => {
    // setup
    const family = {
      id: 'f1',
      status: 1
    };
    initialState.families = [{
      id: 'f1'
    }];
    finalState.families = [family];

    // function under test
    const state = mapReducer.mapData(initialState, {
      type: types.UPDATE_FAMILY_STATUS,
      ...family
    });

    // expectations
    expect(state).toEqual(finalState);
  });
});

test('SET_LAST_CHALLENGES_MODIFIED', () => {
  // setup
  const lastChallengesModified = ['c1', 'c2'];
  finalState.lastChallengesModified = lastChallengesModified;

  // function under test
  const state = mapReducer.mapData(initialState, {
    type: types.SET_LAST_CHALLENGES_MODIFIED,
    lastChallengesModified
  });

  // expectations
  expect(state).toEqual(finalState);
});

test('SET_LAST_PRODUCT_COMPLETED', () => {
  // setup
  const lastProductCompleted = 'p1';
  finalState.lastProductCompleted = lastProductCompleted;

  // function under test
  const state = mapReducer.mapData(initialState, {
    type: types.SET_LAST_PRODUCT_COMPLETED,
    lastProductCompleted
  });

  // expectations
  expect(state).toEqual(finalState);
});

test('RESET_LAST_PRODUCT_COMPLETED', () => {
  // setup
  initialState.lastProductCompleted = 'foo';

  // function under test
  const state = mapReducer.mapData(initialState, {
    type: types.RESET_LAST_PRODUCT_COMPLETED
  });

  // expectations
  expect(state).toEqual(finalState);
});

test('SET_CURRENT_FAMILY_PRODUCT', () => {
  // setup
  const currentMap = 'm1';
  const currentFamily = 'm1f2';
  const currentProduct = 'p3';
  finalState.currentMap = currentMap;
  finalState.currentFamily = currentFamily;
  finalState.currentProduct = currentProduct;

  // function under test
  const state = mapReducer.mapData(initialState, {
    type: types.SET_CURRENT_FAMILY_PRODUCT,
    currentMap,
    currentFamily,
    currentProduct
  });

  // expectations
  expect(state).toEqual(finalState);
});

describe('ADD_PERFECT_CHALLENGE', () => {
  test('adds a new challenge to the list', () => {
    // setup
    const challenge = 'foo';
    finalState.perfect = [challenge];

    // function under test
    const state = mapReducer.mapData(initialState, {
      type: types.ADD_PERFECT_CHALLENGE,
      challenge
    });

    // expectations
    expect(state).toEqual(finalState);
  });

  test('adds an existing  challenge to the list', () => {
    // setup
    const challenge = 'foo';
    initialState.perfect = [challenge];
    finalState.perfect = [challenge];

    // function under test
    const state = mapReducer.mapData(initialState, {
      type: types.ADD_PERFECT_CHALLENGE,
      challenge
    });

    // expectations
    expect(state).toEqual(finalState);
  });
});

test('SET_COMPLETED_PRODUCTS', () => {
  // setup
  const products = ['a', 'b', 'c'];
  finalState.completedProducts = products;

  // function under test
  const state = mapReducer.mapData(initialState, {
    type: types.SET_COMPLETED_PRODUCTS,
    products
  });

  // expectations
  expect(state).toEqual(finalState);
});

test('ADD_COMPLETED_PRODUCT', () => {
  // setup
  const productId = 'irrelevant';
  finalState.completedProducts = [productId];
  finalState.completedProductsSession = true;

  // function under test
  const state = mapReducer.mapData(initialState, {
    type: types.ADD_COMPLETED_PRODUCT,
    productId
  });

  // expectations
  expect(state).toEqual(finalState);
});

test('SET_COMPLETED_CHALLENGES', () => {
  // setup
  const challenges = ['a', 'b', 'c'];
  finalState.completedChallenges = challenges;

  // function under test
  const state = mapReducer.mapData(initialState, {
    type: types.SET_COMPLETED_CHALLENGES,
    challenges
  });

  // expectations
  expect(state).toEqual(finalState);
});

test('ADD_COMPLETED_CHALLENGE', () => {
  // setup
  const challengeId = 'irrelevant';
  finalState.completedChallenges = [challengeId];
  finalState.completedChallengesSession = true;

  // function under test
  const state = mapReducer.mapData(initialState, {
    type: types.ADD_COMPLETED_CHALLENGE,
    challengeId
  });

  // expectations
  expect(state).toEqual(finalState);
});

test('RESET_PROGRESS', () => {
  // setup
  initialState = {
    challenges: [{
      id: 'c1',
      productId: 'p1',
      familyId: 'f1'
    }],
    families: [{
      id: 'f1'
    }],
    initialised: true
  };

  // function under test
  const state = mapReducer.mapData(initialState, {
    type: types.RESET_PROGRESS
  });

  // expectations
  expect(state).toEqual(finalState);
});

test('SET_PRODUCT_PAGE_VIEWED_SESSION', () => {
  // setup
  finalState.productPageViewedSession = true;

  // function under test
  const state = mapReducer.mapData(initialState, {
    type: types.SET_PRODUCT_PAGE_VIEWED_SESSION
  });

  // expectations
  expect(state).toEqual(finalState);
});
