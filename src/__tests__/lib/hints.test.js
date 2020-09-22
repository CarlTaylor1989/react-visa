import * as lib from '../../lib/hints';

let state = {};

beforeEach(() => {
  state = {
    clients: [
      {
        id: 'client1',
        reqCorrect: false,
      },
      {
        id: 'client2',
        reqCorrect: true,
      }
    ],
    clientShowing: 'client1',
    displayReqFeedback: true,
    completedProducts: [],
    completedChallenges: [],
    bonusStreak: 0,
    productPageInactive: false
  };
});

test('function getHints()', () => {
  const result = [
    {
      id: 'h1',
      group: 'diagnostic'
    }
  ];
  const output = lib.getHints('diagnostic');
  expect(output).toEqual(result);
});

describe('function getHintId()', () => {
  test('hint exists', () => {
    const result = 'h4';
    const output = lib.getHintId('network', 2);
    expect(output).toEqual(result);
  });

  test("hint doesn't exist", () => {
    const result = null;
    const output = lib.getHintId('network', 50);
    expect(output).toEqual(result);
  });
});

describe('function networkHintAccessible()', () => {
  test('case h2', () => {
    const result = true;
    const output = lib.networkHintAccessible('h2', state);
    expect(output).toEqual(result);
  });

  test('case h3', () => {
    state.completedChallenges.push('irrelevant');
    const result = true;
    const output = lib.networkHintAccessible('h3', state);
    expect(output).toEqual(result);
  });

  test('case h7', () => {
    state.completedProducts.push('irrelevant');
    const result = true;
    const output = lib.networkHintAccessible('h7', state);
    expect(output).toEqual(result);
  });

  test('case h8', () => {
    state.bonusStreak = 3;
    const result = true;
    const output = lib.networkHintAccessible('h8', state);
    expect(output).toEqual(result);
  });

  test('new hint with no unique requirements', () => {
    const result = true;
    const output = lib.networkHintAccessible('h25', state);
    expect(output).toEqual(result);
  });
});

describe('function productHintAccessible()', () => {
  test('case h9', () => {
    state.completedChallenges.push('irrelevant');
    const result = true;
    const output = lib.productHintAccessible('h9', state);
    expect(output).toEqual(result);
  });

  test('case h10', () => {
    const result = false;
    const output = lib.productHintAccessible('h10', state);
    expect(output).toEqual(result);
  });

  test('new hint with no unique requirements', () => {
    const result = true;
    const output = lib.productHintAccessible('h50', state);
    expect(output).toEqual(result);
  });
});

describe('function clientProposalHintAccesible()', () => {
  test('case h12 returns true reqCorrect false', () => {
    const result = true;
    const output = lib.clientProposalHintAccesible('h12', state);
    expect(output).toEqual(result);
  });

  test('case h12 returns true reqCorrect true', () => {
    const result = true;
    state.clients[0].reqCorrect = true;
    const output = lib.clientProposalHintAccesible('h12', state);
    expect(output).toEqual(result);
  });

  test('case h12 returns false', () => {
    const result = false;
    state.clients[0].reqCorrect = true;
    state.displayReqFeedback = false;
    const output = lib.clientProposalHintAccesible('h12', state);
    expect(output).toEqual(result);
  });

  test('case h13 returns true', () => {
    state.clientShowing = 'client2';
    state.displayReqFeedback = false;
    const result = true;
    const output = lib.clientProposalHintAccesible('h13', state);
    expect(output).toEqual(result);
  });

  test('case h13 returns false', () => {
    state.clientShowing = 'client2';
    const result = false;
    const output = lib.clientProposalHintAccesible('h13', state);
    expect(output).toEqual(result);
  });

  test('new hint with no unique requirements', () => {
    const result = true;
    const output = lib.clientProposalHintAccesible('h50', state);
    expect(output).toEqual(result);
  });
});

describe('function hintAccessible()', () => {
  test('network hint', () => {
    const result = true;
    state.completedChallenges.push('irrelevant');
    const output = lib.hintAccessible('network', 'h3', state);
    expect(output).toEqual(result);
  });

  test('product hint', () => {
    const result = true;
    state.completedChallenges.push('irrelevant');
    const output = lib.hintAccessible('product', 'h9', state);
    expect(output).toEqual(result);
  });

  test('diagnostic hint', () => {
    const result = true;
    const output = lib.hintAccessible('diagnostic', 'h1', state);
    expect(output).toEqual(result);
  });

  test('clientselection hint', () => {
    const result = true;
    const output = lib.hintAccessible('clientselection', 'h11', state);
    expect(output).toEqual(result);
  });

  test('clientproposal hint', () => {
    const result = true;
    const output = lib.hintAccessible('clientproposal', 'h12', state);
    expect(output).toEqual(result);
  });

  test('default hint', () => {
    const result = true;
    state.completedChallenges.push('irrelevant');
    const output = lib.hintAccessible('undefined', '', state);
    expect(output).toEqual(result);
  });

  test('non string identifier hint', () => {
    const result = false;
    const output = lib.hintAccessible('proposal', 123, state);
    expect(output).toEqual(result);
  });
});

describe('function getNextHintIndex()', () => {
  test('nextIndex used in getNextHintIndexRecursive()', () => {
    state.completedChallenges.push('irrelevant');
    const result = 2;
    const output = lib.getNextHintIndex('network', 1, state);
    expect(output).toEqual(result);
  });

  test('later index used in getNextHintIndexRecursive()', () => {
    const result = 0;
    const output = lib.getNextHintIndex('network', 5, state);
    expect(output).toEqual(result);
  });
});

describe('function getHintIndexFromState()', () => {
  test('index found', () => {
    const hints = [
      { group: 'diagnostic', index: 0 },
      { group: 'network', index: 0 },
      { group: 'product', index: 2 },
      { group: 'proposal', index: 0 },
      { group: 'proposalpanel', index: 0 }
    ];
    const result = 2;
    const output = lib.getHintIndexFromState(hints, 'product');
    expect(output).toEqual(result);
  });

  test('index not found', () => {
    const hints = [
      { group: 'diagnostic', index: 0 },
      { group: 'network', index: 0 },
      { group: 'product', index: 0 },
      { group: 'proposal', index: 0 },
      { group: 'proposalpanel', index: 0 }
    ];
    const result = null;
    const output = lib.getHintIndexFromState(hints, 'undefined');
    expect(output).toEqual(result);
  });
});
