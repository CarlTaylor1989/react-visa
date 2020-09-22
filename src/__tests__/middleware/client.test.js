import * as middleware from '../../middleware/clients';
import * as types from '../../actions/clientTypes';
import {
  CLIENT_IN_PROGRESS,
  CLIENT_LOCKED,
  CLIENT_COMPLETED,
  CLIENT_GIVENUP
} from '../../config/constants';
import { getClientLockedDuration, getClientDifficultyScore } from '../../lib/clients';

jest.mock('../../actions/client');
jest.mock('../../lib/clients');

const next = jest.fn();
const store = {
  dispatch: jest.fn(),
  getState: jest.fn()
};
let clientProposalData;

describe('method setAllClients()', () => {
  test('ignores the current action', () => {
    middleware.setAllClients(store)(next)({ type: 'foo' });
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Object));
  });

  test('adds two clients to the list', () => {
    // setup
    const action = {
      type: types.SET_ALL_CLIENTS,
      clients: ['foo', 'bar']
    };
    clientProposalData = {
      clients: []
    };
    store.getState.mockReturnValue({ clientProposalData });

    // function under test
    middleware.setAllClients(store)(next)(action);

    // expectation
    expect(next).toHaveBeenCalledWith(expect.any(Object));
  });
});

describe('method setRequirementFeedback()', () => {
  beforeEach(() => {
    getClientDifficultyScore.mockImplementation(() => 10000);
  });

  test('ignores the current action', () => {
    middleware.setRequirementFeedback(store)(next)({ type: 'foo' });
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Object));
  });

  test('marks the requirement as correct and it displays the feedback', () => {
    // setup
    const action = {
      type: types.SET_REQUIREMENT_FEEDBACK,
      correct: true
    };
    clientProposalData = {
      clientShowing: 'irrelevant'
    };
    store.getState.mockReturnValue({ clientProposalData });

    // function under test
    middleware.setRequirementFeedback(store)(next)(action);

    // expectation
    expect(next).toHaveBeenCalled();
  });

  test('increases the number of attempts and it displays the feedback', () => {
    // setup
    const action = {
      type: types.SET_REQUIREMENT_FEEDBACK,
      correct: false
    };
    clientProposalData = {
      clientShowing: 'irrelevant'
    };
    store.getState.mockReturnValue({ clientProposalData });

    // function under test
    middleware.setRequirementFeedback(store)(next)(action);

    // expectation
    expect(next).toHaveBeenCalled();
  });
});

describe('method lockClient', () => {
  beforeEach(() => {
    getClientLockedDuration.mockImplementation(() => 1);
  });

  test('ignores the current action', () => {
    middleware.lockClient(store)(next)({ type: 'foo' });
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Object));
  });

  test('locks the current client', () => {
    // setup
    const action = {
      type: types.SET_CLIENT_STATUS,
      client: 'irrelevant',
      status: CLIENT_LOCKED
    };
    clientProposalData = {
      clients: [{
        id: action.client,
        reqAttempts: 1
      }]
    };
    store.getState.mockReturnValue({ clientProposalData });

    // function under test
    middleware.lockClient(store)(next)(action);

    // expectations
    expect(next).toHaveBeenCalledWith(expect.any(Object));
    expect(store.dispatch).toHaveBeenCalled();
  });

  test('client is in progress', () => {
    // setup
    const action = {
      type: types.SET_CLIENT_STATUS,
      client: 'irrelevant',
      status: CLIENT_IN_PROGRESS
    };
    clientProposalData = {
      clients: [{
        id: action.client,
        reqAttempts: 1
      }]
    };
    store.getState.mockReturnValue({ clientProposalData });

    // function under test
    middleware.lockClient(store)(next)(action);

    // expectations
    expect(next).toHaveBeenCalledWith(expect.any(Object));
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});

describe('method setSolutionFeedback()', () => {
  test('ignores the current action', () => {
    middleware.setSolutionFeedback(store)(next)({ type: 'foo' });
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Object));
  });

  test('marks the solution as correct and it displays the feedback', () => {
    // setup
    const action = {
      type: types.SET_SOLUTION_FEEDBACK,
      correct: true
    };
    clientProposalData = {
      clientShowing: 'irrelevant'
    };
    store.getState.mockReturnValue({ clientProposalData });

    // function under test
    middleware.setSolutionFeedback(store)(next)(action);

    // expectation
    expect(next).toHaveBeenCalled();
  });

  test('increases the attempts and it displays the incorrect feedback', () => {
    // setup
    const action = {
      type: types.SET_SOLUTION_FEEDBACK,
      correct: false
    };
    clientProposalData = {
      clientShowing: 'irrelevant'
    };
    store.getState.mockReturnValue({ clientProposalData });

    // function under test
    middleware.setSolutionFeedback(store)(next)(action);

    // expectation
    expect(next).toHaveBeenCalled();
  });
});

describe('method solutionCompleted()', () => {
  const clientId = 'id0';
  beforeEach(() => {
    clientProposalData = {
      clients: [
        { id: 'irrelevant', solutionAttempts: 2 },
        { id: clientId, solutionAttempts: 1 }
      ]
    };
    store.getState.mockReturnValue({ clientProposalData });
  });

  test('ignores the current action', () => {
    middleware.solutionCompleted(store)(next)({ type: 'foo' });
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Object));
  });

  test('client completed', () => {
    // setup
    const action = {
      type: types.SET_CLIENT_STATUS,
      status: CLIENT_COMPLETED,
      client: clientId
    };

    // function under test
    middleware.solutionCompleted(store)(next)(action);

    // expectation
    expect(next).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledTimes(4);
  });

  test('client givenup', () => {
    // setup
    const action = {
      type: types.SET_CLIENT_STATUS,
      status: CLIENT_GIVENUP,
      client: clientId
    };

    // function under test
    middleware.solutionCompleted(store)(next)(action);

    // expectation
    expect(next).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  test('client locked', () => {
    // setup
    const action = {
      type: types.SET_CLIENT_STATUS,
      status: CLIENT_LOCKED,
      client: clientId
    };

    // function under test
    middleware.solutionCompleted(store)(next)(action);

    // expectation
    expect(next).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
