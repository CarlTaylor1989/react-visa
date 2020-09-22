import { createReducer } from 'redux-create-reducer';
import * as types from '../actions/clientTypes';

export const initialState = {
  clientShowing: '',
  clients: [],
  displayReqFeedback: false,
  displaySoluFeedback: false,
  locked: [],
};

export const clientProposalData = createReducer((initialState), {
  [types.SET_CLIENT_PROPOSAL_DATA](state, action) {
    return {
      ...state,
      ...action.clientProposalData
    };
  },
  [types.SET_CLIENT_SHOWING](state, action) {
    return {
      ...state,
      clientShowing: action.clientShowing
    };
  },
  [types.SET_ALL_CLIENTS](state, action) {
    return {
      ...state,
      clients: [
        ...state.clients,
        ...action.clients
      ]
    };
  },
  [types.SET_CLIENT_STATUS](state, action) {
    return {
      ...state,
      clients: state.clients.map(client => (
        client.id === action.client ? {
          ...client,
          status: action.status
        } : client))
    };
  },
  [types.INCREASE_REQUIREMENT_ATTEMPTS](state, action) {
    return {
      ...state,
      clients: state.clients.map(client => (
        client.id === action.client ? {
          ...client,
          reqAttempts: client.reqAttempts + 1
        } : client))
    };
  },
  [types.SET_REQUIREMENT_CORRECTNESS](state, action) {
    return {
      ...state,
      clients: state.clients.map(client => (
        client.id === action.client ? {
          ...client,
          reqAttempts: client.reqAttempts + 1,
          reqCorrect: true
        } : client))
    };
  },
  [types.RESET_REQUIREMENT_ATTEMPTS](state, action) {
    return {
      ...state,
      clients: state.clients.map(client => (
        client.id === action.client ? {
          ...client,
          reqAttempts: 0
        } : client))
    };
  },
  [types.DISPLAY_REQUIREMENT_FEEDBACK](state) {
    return {
      ...state,
      displayReqFeedback: true
    };
  },
  [types.HIDE_REQUIREMENT_FEEDBACK](state) {
    return {
      ...state,
      displayReqFeedback: false
    };
  },
  [types.SET_CLIENT_LOCKED](state, action) {
    return {
      ...state,
      locked: [
        ...state.locked,
        {
          id: action.client,
          duration: action.duration,
          start: action.start
        }
      ]
    };
  },
  [types.UNLOCK_CLIENT](state, action) {
    return {
      ...state,
      locked: state.locked.filter(data => data.id !== action.client)
    };
  },
  [types.SET_PROPOSAL_AS_COMPLETE](state, action) {
    return {
      ...state,
      clients: state.clients.map(client => (
        client.id === action.client ? {
          ...client,
          proposalCompleted: true
        } : client))
    };
  },
  [types.SET_SOLUTION_CORRECTNESS](state, action) {
    return {
      ...state,
      clients: state.clients.map(client => (
        client.id === action.client ? {
          ...client,
          solutionCorrect: true
        } : client))
    };
  },
  [types.DISPLAY_SOLUTION_FEEDBACK](state) {
    return {
      ...state,
      displaySoluFeedback: true
    };
  },
  [types.HIDE_SOLUTION_FEEDBACK](state) {
    return {
      ...state,
      displaySoluFeedback: false
    };
  },
  [types.INCREASE_SOLUTION_ATTEMPTS](state, action) {
    return {
      ...state,
      clients: state.clients.map(client => (
        client.id === action.client ? {
          ...client,
          solutionAttempts: client.solutionAttempts + 1
        } : client))
    };
  },
  [types.SET_SOLUTION_SCORE](state, action) {
    return {
      ...state,
      clients: state.clients.map(client => (
        client.id === action.client ? {
          ...client,
          solutionScore: action.score
        } : client))
    };
  }
});

export default { clientProposalData };
