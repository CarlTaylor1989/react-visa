/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  ProposalPage,
  mapStateToProps,
  mapDispatchToProps
} from '../../../../../components/game/clientproposals/proposals/ProposalPage';
import { getClientDifficultyScore } from '../../../../../lib/clients';
import { sendInteractionData } from '../../../../../tracking/xapi/XApiAdapter';
import * as actions from '../../../../../actions/client';
import * as types from '../../../../../actions/clientTypes';
import { clientsPropsReferrer } from '../../../../../config/referrers';

jest.mock('../../../../../lib/clients');
jest.mock('../../../../../tracking/xapi/XApiAdapter');

let mockProps;
beforeEach(() => {
  mockProps = {
    clientShowing: 'client1',
    displayReqFeedback: false,
    displaySoluFeedback: false,
    hideRequirementFeedback: jest.fn(),
    displaySolutionFeedback: jest.fn(),
    hideSolutionFeedback: jest.fn(),
    push: jest.fn(),
    screenReferrer: 'irrelevant',
    setClientShowing: jest.fn(),
    setClientStatus: jest.fn(),
    setCurrentHintGroup: jest.fn(),
    setPromptsPaused: jest.fn(),
    setProposalAsComplete: jest.fn()
  };

  getClientDifficultyScore.mockImplementation(() => 50000);
});

test('renders the ProposalPage component with the resources', () => {
  const wrapper = shallow(<ProposalPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ProposalPage component with the products', () => {
  mockProps.clientData = {
    reqCorrect: true
  };
  const wrapper = shallow(<ProposalPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidMount()', () => {
  test('method renders', () => {
    const wrapper = shallow(<ProposalPage {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().timeAvailable).toBeDefined();
  });

  test('solution feedback pop up is displayed as proposal status is completed', () => {
    mockProps.clientData = {
      status: 2
    };
    const wrapper = shallow(<ProposalPage {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().componentDidMount();
    expect(mockProps.displaySolutionFeedback).toHaveBeenCalled();
  });

  test('solution feedback pop up is displayed as proposal status is given up', () => {
    mockProps.clientData = {
      status: 4
    };
    const wrapper = shallow(<ProposalPage {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().componentDidMount();
    expect(mockProps.displaySolutionFeedback).toHaveBeenCalled();
  });
});

test('method componentWillUnmount()', () => {
  // setup
  const wrapper = shallow(<ProposalPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().sendPageStatement = jest.fn();

  // function under test
  wrapper.instance().componentWillUnmount();

  // expectations
  expect(wrapper.instance().sendPageStatement).toHaveBeenCalled();
  expect(mockProps.hideSolutionFeedback).toHaveBeenCalled();
});

test('method onCorrectRequirements()', () => {
  const wrapper = shallow(<ProposalPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().onCorrectRequirements();
  expect(mockProps.hideRequirementFeedback).toHaveBeenCalled();
  expect(wrapper.instance().state.correctRequirements).toBeTruthy();
});

test('method onCorrectSolutions()', () => {
  const wrapper = shallow(<ProposalPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().onCorrectSolutions();
  expect(mockProps.hideSolutionFeedback).toHaveBeenCalled();
  expect(wrapper.instance().state.correctSolutions).toBeTruthy();
});

test('method onLockedRequirements()', () => {
  const wrapper = shallow(<ProposalPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().onLockedRequirements();
  expect(mockProps.push).toHaveBeenCalledWith(expect.any(String));
});

test('method onLockClient()', () => {
  const wrapper = shallow(<ProposalPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().onLockClient();
  expect(mockProps.setClientStatus).toHaveBeenCalledWith(expect.any(String), expect.any(Number));
});

test('method onGoBack()', () => {
  const wrapper = shallow(<ProposalPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().onGoBack();
  expect(wrapper.instance().state.forceTooltipHide).toBeTruthy();
});

test('method onSolutionExited()', () => {
  const wrapper = shallow(<ProposalPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().onSolutionExited();
  expect(mockProps.setPromptsPaused).toHaveBeenCalledWith(false);
});

test('method onSolutionOpen()', () => {
  const wrapper = shallow(<ProposalPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().onSolutionOpen();
  expect(mockProps.setPromptsPaused).toHaveBeenCalledWith(true);
});

test('method sendPageStatement()', () => {
  // setup
  const wrapper = shallow(<ProposalPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().timeAvailable = new Date();

  // function under test
  wrapper.instance().sendPageStatement();

  // expectation
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'experienced',
    activity: expect.objectContaining({
      id: expect.stringContaining(`${clientsPropsReferrer}/`),
      type: 'assessment',
      title: expect.any(String),
      description: expect.any(String)
    }),
    response: expect.objectContaining({
      timeAvailable: expect.any(Date),
      timeResponse: expect.any(Date)
    }),
    parent: clientsPropsReferrer,
    referrer: expect.any(String)
  }));
});

test('method closeResourcePopup()', () => {
  const wrapper = shallow(<ProposalPage {...mockProps} />);
  wrapper.instance().setState({
    isResourcePopupOpen: true,
    selectedResourceType: 'report',
    selectedResourceId: 'res11'
  });

  // function under test
  wrapper.instance().closeResourcePopup();

  // expectations
  expect(wrapper.instance().state.isResourcePopupOpen).toBe(false);
  expect(wrapper.instance().state.selectedResourceType).toBe('');
  expect(wrapper.instance().state.selectedResourceId).toBe('');
});

test('method openResourcePopup()', () => {
  // setup
  const wrapper = shallow(<ProposalPage {...mockProps} />);

  // function under test
  wrapper.instance().openResourcePopup('res10', 'call');

  // expectations
  expect(wrapper.instance().state.isResourcePopupOpen).toBe(true);
  expect(wrapper.instance().state.selectedResourceType).toBe('call');
  expect(wrapper.instance().state.selectedResourceId).toBe('res10');
});

test('should mapStateToProps', () => {
  // setup
  const state = {
    genericData: {
      screenReferrer: 'irrelevant'
    },
    clientProposalData: {
      clientShowing: 'irrelevant',
      clients: [{
        id: 'irrelevant'
      }],
      displayReqFeedback: false,
      displaySoluFeedback: false
    },
  };

  // function under test
  const props = mapStateToProps(state);

  // expectation
  expect(props).toEqual({
    ...state.genericData,
    clientData: expect.any(Object),
    clientShowing: state.clientProposalData.clientShowing,
    displayReqFeedback: state.clientProposalData.displayReqFeedback,
    displaySoluFeedback: state.clientProposalData.displaySoluFeedback
  });
});

test('should mapDispatchToProps', () => {
  const dispatch = jest.fn();
  jest.spyOn(actions, 'hideRequirementFeedback').mockReturnValue('hideRequirementFeedback()');
  const props = mapDispatchToProps(dispatch);
  props.hideRequirementFeedback();
  expect(dispatch).toHaveBeenCalledWith({
    type: types.HIDE_REQUIREMENT_FEEDBACK
  });
});
