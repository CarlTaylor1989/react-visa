import * as clientActions from '../actions/client';
import * as clientTypes from '../actions/clientTypes';
import { setDisplayPrompts } from '../actions/prompts';
import { increaseScore, increaseClientNeeds, increaseProposalsCompleted } from '../actions/score';
import {
  CLIENT_NOT_STARTED,
  CLIENT_LOCKED,
  CLIENT_COMPLETED,
  CLIENT_GIVENUP
} from '../config/constants';
import {
  getClientLockedDuration,
  getClientDifficultyScore,
  getClientProposalScore
} from '../lib/clients';

export const setAllClients = () => next => (action) => {
  const updatedAction = action;

  if (action.type === clientTypes.SET_ALL_CLIENTS) {
    updatedAction.clients = updatedAction.clients.map(client => ({
      id: client,
      reqAttempts: 0,
      reqCorrect: false,
      solutionAttempts: 0,
      solutionCorrect: false,
      solutionScore: 0,
      status: CLIENT_NOT_STARTED
    }));
  }

  next(updatedAction);
};

export const setRequirementFeedback = ({ dispatch, getState }) => next => (action) => {
  if (action.type === clientTypes.SET_REQUIREMENT_FEEDBACK) {
    const client = getState().clientProposalData.clientShowing;
    if (action.correct) {
      next(clientActions.displayRequirementFeedback());
      dispatch(clientActions.setRequirementCorrectness(client));
      dispatch(increaseScore(getClientDifficultyScore(client)));
      dispatch(increaseClientNeeds());
      dispatch(setDisplayPrompts());
    } else {
      next(clientActions.displayRequirementFeedback());
      dispatch(clientActions.increaseRequirementAttempts(client));
    }
  } else {
    next(action);
  }
};

export const lockClient = ({ dispatch, getState }) => next => (action) => {
  next(action);

  if (action.type === clientTypes.SET_CLIENT_STATUS) {
    const clients = getState().clientProposalData.clients;
    const clientData = clients.find(data => data.id === action.client);
    const duration = getClientLockedDuration(clientData.reqAttempts);

    if (action.status === CLIENT_LOCKED) {
      dispatch(clientActions.setLockedClient(
        action.client,
        new Date().getTime(),
        duration
      ));
    }
  }
};

export const setSolutionFeedback = ({ dispatch, getState }) => next => (action) => {
  if (action.type === clientTypes.SET_SOLUTION_FEEDBACK) {
    const client = getState().clientProposalData.clientShowing;
    dispatch(clientActions.increaseSolutionAttempts(client));
    if (action.correct) {
      dispatch(clientActions.setSolutionCorrectness(client));
      dispatch(clientActions.setClientStatus(client, CLIENT_COMPLETED));
    }
    dispatch(clientActions.displaySolutionFeedback());
  }
  next(action);
};

export const solutionCompleted = ({ dispatch, getState }) => next => (action) => {
  next(action);

  if (action.type === clientTypes.SET_CLIENT_STATUS) {
    let score = 0;
    if (action.status === CLIENT_COMPLETED) {
      const clients = getState().clientProposalData.clients;
      const clientData = clients.find(client => client.id === action.client);
      score = getClientProposalScore(action.client, clientData.solutionAttempts - 1);
      dispatch(increaseScore(score));
      dispatch(increaseProposalsCompleted());
    }
    if (action.status === CLIENT_COMPLETED || action.status === CLIENT_GIVENUP) {
      dispatch(clientActions.setSolutionScore(action.client, score));
      dispatch(clientActions.setProposalAsComplete(action.client));
    }
  }
};

export default [
  lockClient,
  setAllClients,
  setRequirementFeedback,
  setSolutionFeedback,
  solutionCompleted
];
