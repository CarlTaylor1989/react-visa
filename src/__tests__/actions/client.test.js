import * as actions from '../../actions/client';
import * as types from '../../actions/clientTypes';

test('method setClientProposalData()', () => {
  const clientProposalData = { foo: 'bar' };
  const output = actions.setClientProposalData(clientProposalData);
  expect(output).toEqual({
    type: types.SET_CLIENT_PROPOSAL_DATA,
    clientProposalData
  });
});

test('method setClientShowing()', () => {
  const clientShowing = 'client';
  const output = actions.setClientShowing(clientShowing);
  expect(output).toEqual({
    type: types.SET_CLIENT_SHOWING,
    clientShowing
  });
});

test('method setAllClients()', () => {
  const clients = [];
  const output = actions.setAllClients(clients);
  expect(output).toEqual({
    type: types.SET_ALL_CLIENTS,
    clients
  });
});

test('method setClientStatus()', () => {
  const client = 'irrelevant';
  const status = 0;
  const output = actions.setClientStatus(client, status);
  expect(output).toEqual({
    type: types.SET_CLIENT_STATUS,
    client,
    status
  });
});

test('method increaseRequirementAttempts()', () => {
  const client = 'irrelevant';
  const output = actions.increaseRequirementAttempts(client);
  expect(output).toEqual({
    type: types.INCREASE_REQUIREMENT_ATTEMPTS,
    client
  });
});

test('method setRequirementCorrectness()', () => {
  const client = 'irrelevant';
  const output = actions.setRequirementCorrectness(client);
  expect(output).toEqual({
    type: types.SET_REQUIREMENT_CORRECTNESS,
    client
  });
});

test('method resetRequirementAttempts()', () => {
  const client = 'irrelevant';
  const output = actions.resetRequirementAttempts(client);
  expect(output).toEqual({
    type: types.RESET_REQUIREMENT_ATTEMPTS,
    client
  });
});

test('method displayRequirementFeedback()', () => {
  const output = actions.displayRequirementFeedback();
  expect(output).toEqual({
    type: types.DISPLAY_REQUIREMENT_FEEDBACK
  });
});

test('method hideRequirementFeedback()', () => {
  const output = actions.hideRequirementFeedback();
  expect(output).toEqual({
    type: types.HIDE_REQUIREMENT_FEEDBACK
  });
});

test('method setRequirementFeedback()', () => {
  const correct = true;
  const output = actions.setRequirementFeedback(correct);
  expect(output).toEqual({
    type: types.SET_REQUIREMENT_FEEDBACK,
    correct
  });
});

test('method setLockedClient()', () => {
  // setup
  const client = 'irrelevant';
  const start = new Date().getTime();
  const duration = 60;

  // function under test
  const output = actions.setLockedClient(client, start, duration);

  // expectation
  expect(output).toEqual({
    type: types.SET_CLIENT_LOCKED,
    client,
    start,
    duration
  });
});

test('method unlockClient()', () => {
  const client = 'irrelevant';
  const output = actions.unlockClient(client);
  expect(output).toEqual({
    type: types.UNLOCK_CLIENT,
    client
  });
});

test('method displaySolutionFeedback()', () => {
  const output = actions.displaySolutionFeedback();
  expect(output).toEqual({
    type: types.DISPLAY_SOLUTION_FEEDBACK
  });
});

test('method hideSolutionFeedback()', () => {
  const output = actions.hideSolutionFeedback();
  expect(output).toEqual({
    type: types.HIDE_SOLUTION_FEEDBACK
  });
});

test('method setSolutionFeedback()', () => {
  const correct = true;
  const output = actions.setSolutionFeedback(correct);
  expect(output).toEqual({
    type: types.SET_SOLUTION_FEEDBACK,
    correct
  });
});

test('method setSolutionCorrectness()', () => {
  const client = 'irrelevant';
  const output = actions.setSolutionCorrectness(client);
  expect(output).toEqual({
    type: types.SET_SOLUTION_CORRECTNESS,
    client
  });
});

test('method increaseSolutionAttempts()', () => {
  const client = 'irrelevant';
  const output = actions.increaseSolutionAttempts(client);
  expect(output).toEqual({
    type: types.INCREASE_SOLUTION_ATTEMPTS,
    client
  });
});

test('method setProposalAsComplete()', () => {
  const client = 'irrelevant';
  const output = actions.setProposalAsComplete(client);
  expect(output).toEqual({
    type: types.SET_PROPOSAL_AS_COMPLETE,
    client
  });
});

test('method setSolutionScore()', () => {
  const client = 'irrelevant';
  const score = 1000;
  const output = actions.setSolutionScore(client, score);
  expect(output).toEqual({
    type: types.SET_SOLUTION_SCORE,
    client,
    score
  });
});
