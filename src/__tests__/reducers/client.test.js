import * as types from '../../actions/clientTypes';
import * as clientReducer from '../../reducers/clients';

let initialState;
let finalState;
beforeEach(() => {
  initialState = {
    ...clientReducer.initialState
  };
  finalState = {
    ...initialState
  };
});

test('return the initial state', () => {
  expect(clientReducer.clientProposalData(undefined, {})).toEqual(initialState);
});

test('SET_CLIENT_PROPOSAL_DATA', () => {
  // setup
  const clientProposalData = { foo: 'bar' };
  finalState = {
    foo: 'bar'
  };
  const state = clientReducer.clientProposalData(clientProposalData, {
    type: types.SET_CLIENT_PROPOSAL_DATA,
    clientProposalData
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SET_CLIENT_SHOWING', () => {
  // setup
  const clientShowing = 'irrelevant';
  finalState = {
    ...initialState,
    clientShowing
  };

  // function under test
  const state = clientReducer.clientProposalData(initialState, {
    type: types.SET_CLIENT_SHOWING,
    clientShowing
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SET_ALL_CLIENTS', () => {
  // setup
  const clients = [{ id: 'irrelevant' }];
  finalState = {
    ...initialState,
    clients
  };

  // function under test
  const state = clientReducer.clientProposalData(initialState, {
    type: types.SET_ALL_CLIENTS,
    clients
  });

  // expectation
  expect(state).toEqual(finalState);
});

describe('SET_CLIENT_STATUS', () => {
  test('updates the status of an existing client', () => {
    // setup
    const client = 'irrelevant';
    const status = 1;
    initialState.clients = [{
      id: client,
      status: 0
    }];
    finalState = {
      ...initialState,
      clients: [{
        id: client,
        status: 1
      }]
    };

    // function under test
    const state = clientReducer.clientProposalData(initialState, {
      type: types.SET_CLIENT_STATUS,
      client,
      status
    });

    // expectation
    expect(state).toEqual(finalState);
  });

  test('client not found', () => {
    // setup
    const client = 'foo';
    const status = 1;
    initialState.clients = [{
      id: 'bar',
      status: 0
    }];
    finalState = {
      ...initialState,
    };

    // function under test
    const state = clientReducer.clientProposalData(initialState, {
      type: types.SET_CLIENT_STATUS,
      client,
      status
    });

    // expectation
    expect(state).toEqual(finalState);
  });
});

describe('INCREASE_REQUIREMENT_ATTEMPTS', () => {
  test('increases the number of attempts of an existing client', () => {
    // setup
    const client = 'irrelevant';
    initialState.clients = [{
      id: client,
      reqAttempts: 0
    }];
    finalState = {
      ...initialState,
      clients: [{
        id: client,
        reqAttempts: 1
      }]
    };

    // function under test
    const state = clientReducer.clientProposalData(initialState, {
      type: types.INCREASE_REQUIREMENT_ATTEMPTS,
      client
    });

    // expectation
    expect(state).toEqual(finalState);
  });

  test('client not found', () => {
    // setup
    const client = 'foo';
    initialState.clients = [{
      id: 'bar',
      reqAttempts: 0
    }];
    finalState = {
      ...initialState,
    };

    // function under test
    const state = clientReducer.clientProposalData(initialState, {
      type: types.INCREASE_REQUIREMENT_ATTEMPTS,
      client
    });

    // expectation
    expect(state).toEqual(finalState);
  });
});

describe('SET_REQUIREMENT_CORRECTNESS', () => {
  test('marks the requirement as correct and increases the number of attempts of an existing client', () => { // eslint-disable-line max-len
    // setup
    const client = 'irrelevant';
    initialState.clients = [{
      id: client,
      reqAttempts: 0,
      reqCorrect: false
    }];
    finalState = {
      ...initialState,
      clients: [{
        id: client,
        reqAttempts: 1,
        reqCorrect: true
      }]
    };

    // function under test
    const state = clientReducer.clientProposalData(initialState, {
      type: types.SET_REQUIREMENT_CORRECTNESS,
      client
    });

    // expectation
    expect(state).toEqual(finalState);
  });

  test('client not found', () => {
    // setup
    const client = 'foo';
    initialState.clients = [{
      id: 'bar',
      reqAttempts: 0,
      reqCorrect: false
    }];
    finalState = {
      ...initialState,
    };

    // function under test
    const state = clientReducer.clientProposalData(initialState, {
      type: types.SET_REQUIREMENT_CORRECTNESS,
      client
    });

    // expectation
    expect(state).toEqual(finalState);
  });
});

describe('RESET_REQUIREMENT_ATTEMPTS', () => {
  test('reset the requirement of an existing client', () => {
    // setup
    const client = 'irrelevant';
    initialState.clients = [{
      id: client,
      reqAttempts: 2,
      reqCorrect: false
    }];
    finalState = {
      ...initialState,
      clients: [{
        id: client,
        reqAttempts: 0,
        reqCorrect: false
      }]
    };

    // function under test
    const state = clientReducer.clientProposalData(initialState, {
      type: types.RESET_REQUIREMENT_ATTEMPTS,
      client
    });

    // expectation
    expect(state).toEqual(finalState);
  });

  test('client not found', () => {
    // setup
    const client = 'foo';
    initialState.clients = [{
      id: 'bar',
      reqAttempts: 0,
      reqCorrect: false
    }];
    finalState = {
      ...initialState,
    };

    // function under test
    const state = clientReducer.clientProposalData(initialState, {
      type: types.RESET_REQUIREMENT_ATTEMPTS,
      client
    });

    // expectation
    expect(state).toEqual(finalState);
  });
});

test('DISPLAY_REQUIREMENT_FEEDBACK', () => {
  // setup
  finalState.displayReqFeedback = true;
  const state = clientReducer.clientProposalData(initialState, {
    type: types.DISPLAY_REQUIREMENT_FEEDBACK
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('HIDE_REQUIREMENT_FEEDBACK', () => {
  // setup
  initialState.displayReqFeedback = true;
  finalState.displayReqFeedback = false;
  const state = clientReducer.clientProposalData(initialState, {
    type: types.HIDE_REQUIREMENT_FEEDBACK
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('SET_CLIENT_LOCKED', () => {
  // setup
  const action = {
    client: 'irrelevant',
    duration: 0,
    start: 0
  };
  finalState.locked = [{
    id: action.client,
    duration: action.duration,
    start: action.start,
  }];
  const state = clientReducer.clientProposalData(initialState, {
    type: types.SET_CLIENT_LOCKED,
    ...action
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('UNLOCK_CLIENT', () => {
  // setup
  const client = 'irrelevant';
  initialState.locked = [{
    id: client,
    duration: 0,
    start: 0,
  }];
  finalState.locked = [];
  const state = clientReducer.clientProposalData(initialState, {
    type: types.UNLOCK_CLIENT,
    client
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('DISPLAY_SOLUTION_FEEDBACK', () => {
  // setup
  finalState.displaySoluFeedback = true;
  const state = clientReducer.clientProposalData(initialState, {
    type: types.DISPLAY_SOLUTION_FEEDBACK
  });

  // expectation
  expect(state).toEqual(finalState);
});

test('HIDE_SOLUTION_FEEDBACK', () => {
  // setup
  initialState.displaySoluFeedback = true;
  finalState.displaySoluFeedback = false;
  const state = clientReducer.clientProposalData(initialState, {
    type: types.HIDE_SOLUTION_FEEDBACK
  });

  // expectation
  expect(state).toEqual(finalState);
});

describe('INCREASE_SOLUTION_ATTEMPTS', () => {
  test('increases the number of attempts of an existing client', () => {
    // setup
    const client = 'irrelevant';
    initialState.clients = [{
      id: client,
      solutionAttempts: 0
    }];
    finalState = {
      ...initialState,
      clients: [{
        id: client,
        solutionAttempts: 1
      }]
    };

    // function under test
    const state = clientReducer.clientProposalData(initialState, {
      type: types.INCREASE_SOLUTION_ATTEMPTS,
      client
    });

    // expectation
    expect(state).toEqual(finalState);
  });

  test('client not found', () => {
    // setup
    const client = 'foo';
    initialState.clients = [{
      id: 'bar',
      solutionAttempts: 0
    }];
    finalState = {
      ...initialState,
    };

    // function under test
    const state = clientReducer.clientProposalData(initialState, {
      type: types.INCREASE_SOLUTION_ATTEMPTS,
      client
    });

    // expectation
    expect(state).toEqual(finalState);
  });
});

describe('SET_SOLUTION_CORRECTNESS', () => {
  test('marks the solution as correct and increases the number of attempts of an existing client', () => { // eslint-disable-line max-len
    // setup
    const client = 'irrelevant';
    initialState.clients = [{
      id: client,
      solutionCorrect: false
    }];
    finalState = {
      ...initialState,
      clients: [{
        id: client,
        solutionCorrect: true
      }]
    };

    // function under test
    const state = clientReducer.clientProposalData(initialState, {
      type: types.SET_SOLUTION_CORRECTNESS,
      client
    });

    // expectation
    expect(state).toEqual(finalState);
  });

  test('client not found', () => {
    // setup
    const client = 'foo';
    initialState.clients = [{
      id: 'bar',
      solutionAttempts: 0,
      solutionCorrect: false
    }];
    finalState = {
      ...initialState,
    };

    // function under test
    const state = clientReducer.clientProposalData(initialState, {
      type: types.SET_SOLUTION_CORRECTNESS,
      client
    });

    // expectation
    expect(state).toEqual(finalState);
  });
});

describe('SET_PROPOSAL_AS_COMPLETE', () => {
  test('marks the proposal as completed', () => {
    // setup
    const client = 'irrelevant';
    initialState.clients = [{
      id: client,
      proposalCompleted: false
    }];
    finalState = {
      ...initialState,
      clients: [{
        id: client,
        proposalCompleted: true
      }]
    };

    // function under test
    const state = clientReducer.clientProposalData(initialState, {
      type: types.SET_PROPOSAL_AS_COMPLETE,
      client
    });

    // expectation
    expect(state).toEqual(finalState);
  });

  test('client not found', () => {
    // setup
    const client = 'foo';
    initialState.clients = [{
      id: 'bar',
      proposalCompleted: false
    }];
    finalState = {
      ...initialState,
    };

    // function under test
    const state = clientReducer.clientProposalData(initialState, {
      type: types.SET_PROPOSAL_AS_COMPLETE,
      client
    });

    // expectation
    expect(state).toEqual(finalState);
  });
});

describe('SET_SOLUTION_SCORE', () => {
  test('marks the proposal as completed', () => {
    // setup
    const client = 'irrelevant';
    const score = 10000;
    initialState.clients = [{
      id: client,
      solutionScore: 0
    }];
    finalState = {
      ...initialState,
      clients: [{
        id: client,
        solutionScore: score
      }]
    };

    // function under test
    const state = clientReducer.clientProposalData(initialState, {
      type: types.SET_SOLUTION_SCORE,
      client,
      score
    });

    // expectation
    expect(state).toEqual(finalState);
  });

  test('client not found', () => {
    // setup
    const client = 'foo';
    const score = 10000;
    initialState.clients = [{
      id: 'bar',
      solutionScore: 0
    }];
    finalState = {
      ...initialState,
    };

    // function under test
    const state = clientReducer.clientProposalData(initialState, {
      type: types.SET_SOLUTION_SCORE,
      client,
      score
    });

    // expectation
    expect(state).toEqual(finalState);
  });
});
