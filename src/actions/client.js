import * as types from './clientTypes';

export const setClientProposalData = clientProposalData => ({
  type: types.SET_CLIENT_PROPOSAL_DATA,
  clientProposalData
});

export const setClientShowing = clientShowing => ({
  type: types.SET_CLIENT_SHOWING,
  clientShowing
});

export const setAllClients = clients => ({
  type: types.SET_ALL_CLIENTS,
  clients
});

export const setClientStatus = (client, status) => ({
  type: types.SET_CLIENT_STATUS,
  client,
  status
});

export const increaseRequirementAttempts = client => ({
  type: types.INCREASE_REQUIREMENT_ATTEMPTS,
  client
});

export const setRequirementCorrectness = client => ({
  type: types.SET_REQUIREMENT_CORRECTNESS,
  client
});

export const resetRequirementAttempts = client => ({
  type: types.RESET_REQUIREMENT_ATTEMPTS,
  client
});

export const displayRequirementFeedback = () => ({
  type: types.DISPLAY_REQUIREMENT_FEEDBACK
});

export const hideRequirementFeedback = () => ({
  type: types.HIDE_REQUIREMENT_FEEDBACK
});

export const setRequirementFeedback = correct => ({
  type: types.SET_REQUIREMENT_FEEDBACK,
  correct
});

export const setLockedClient = (client, start, duration) => ({
  type: types.SET_CLIENT_LOCKED,
  client,
  start,
  duration
});

export const unlockClient = client => ({
  type: types.UNLOCK_CLIENT,
  client
});

export const setProposalAsComplete = client => ({
  type: types.SET_PROPOSAL_AS_COMPLETE,
  client
});

export const setSolutionFeedback = correct => ({
  type: types.SET_SOLUTION_FEEDBACK,
  correct
});

export const setSolutionCorrectness = client => ({
  type: types.SET_SOLUTION_CORRECTNESS,
  client
});

export const displaySolutionFeedback = () => ({
  type: types.DISPLAY_SOLUTION_FEEDBACK
});

export const hideSolutionFeedback = () => ({
  type: types.HIDE_SOLUTION_FEEDBACK
});

export const increaseSolutionAttempts = client => ({
  type: types.INCREASE_SOLUTION_ATTEMPTS,
  client
});

export const setSolutionScore = (client, score) => ({
  type: types.SET_SOLUTION_SCORE,
  client,
  score
});
