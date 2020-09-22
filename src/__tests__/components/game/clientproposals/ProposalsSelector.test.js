/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  ProposalsSelector,
  mapStateToProps,
  mapDispatchToProps
} from '../../../../components/game/clientproposals/ProposalsSelector';
import * as actions from '../../../../actions/hints';
import * as types from '../../../../actions/hintsTypes';
import { sendInteractionData } from '../../../../tracking/xapi/XApiAdapter';
import {
  CLIENT_NOT_STARTED,
  CLIENT_IN_PROGRESS,
  CLIENT_LOCKED
} from '../../../../config/constants';

jest.mock('../../../../tracking/xapi/XApiAdapter');

let mockProps;
beforeEach(() => {
  mockProps = {
    canDisplayIntroPopup: false,
    checkStreakStatus: jest.fn(),
    clients: [],
    clientShowing: '',
    clientIntroSeen: false,
    clientIntroSeenSession: false,
    commit: jest.fn(),
    completed: false,
    initialiseClient: jest.fn(),
    locked: [],
    prepareSuspendData: jest.fn(),
    screenReferrer: 'irrelevant',
    setAllClients: jest.fn(),
    setClientData: jest.fn(),
    setClientIntroSeen: jest.fn(),
    setClientShowing: jest.fn(),
    setCurrentHintGroup: jest.fn(),
    setPromptsPaused: jest.fn(),
    setScreenReferrer: jest.fn(),
    toggleSettingsBtnState: jest.fn()
  };
});

test('renders the ProposalsSelector component', () => {
  const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
    disableLifecycleMethods: true
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ProposalsSelector component with a locked client', () => {
  mockProps.locked = [{ id: 'client1' }];
  const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
    disableLifecycleMethods: true
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ProposalsSelector component with a completed and locked client', () => {
  mockProps.clients = [{
    id: 'client1',
    reqAttempts: 1,
    status: CLIENT_LOCKED
  }];
  const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
    disableLifecycleMethods: true
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method componentDidMount', () => {
  // setup
  const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().parseClientData = jest.fn();

  // function under test
  wrapper.instance().componentDidMount();

  // expectations
  expect(mockProps.checkStreakStatus).toHaveBeenCalled();
  expect(mockProps.setCurrentHintGroup).toHaveBeenCalledWith(expect.any(String));
  expect(wrapper.instance().parseClientData).toHaveBeenCalled();
});

describe('method componentDidMount()', () => {
  test('clears the selected client', () => {
    const wrapper = shallow(<ProposalsSelector {...mockProps} clientShowing="irrelevant" />);
    wrapper.instance().clearSelectedClient = jest.fn();
    wrapper.setProps({ clientShowing: '' });
    expect(wrapper.instance().clearSelectedClient).toHaveBeenCalled();
  });

  test('no previously selected client', () => {
    const wrapper = shallow(<ProposalsSelector {...mockProps} />);
    wrapper.instance().clearSelectedClient = jest.fn();
    wrapper.setProps({ clientShowing: '' });
    expect(wrapper.instance().clearSelectedClient).not.toHaveBeenCalled();
  });
});

test('method componentWillUnmount()', () => {
  // setup
  const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().sendStatements = jest.fn();

  // function under test
  wrapper.instance().componentWillUnmount();

  // expectation
  expect(wrapper.instance().sendStatements).toHaveBeenCalled();
  expect(mockProps.setScreenReferrer).toHaveBeenCalledWith(expect.any(String));
});

describe('method onClientSelected()', () => {
  test('unselects the current client', () => {
    // setup
    const clientId = 'irrelevant';
    const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setState({ selectedClient: clientId });

    // function under test
    wrapper.instance().onClientSelected(clientId);

    // expectation
    expect(wrapper.instance().state.selectedClient).toEqual('');
  });

  test('sets the selected client', () => {
    // setup
    const clientId = 'irrelevant';
    const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
      disableLifecycleMethods: true
    });

    // function under test
    wrapper.instance().onClientSelected(clientId);

    // expectation
    expect(wrapper.instance().state.selectedClient).toEqual(clientId);
  });
});

test('method onClosePopup()', () => {
  // setup
  const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
    disableLifecycleMethods: true
  });

  // function under test
  wrapper.instance().onClosePopup();

  // expectation
  expect(mockProps.setClientIntroSeen).toHaveBeenCalled();
});

describe('method getClientStatus()', () => {
  test('default status returned when client not found', () => {
    // setup
    const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setState({ selectedClient: 'irrelevant' });

    // function under test
    const output = wrapper.instance().getClientStatus();

    // expectation
    expect(output).toEqual(CLIENT_NOT_STARTED);
  });

  test('client found and its status is returned', () => {
    // setup
    mockProps.clients = [{
      id: 'irrelevant',
      status: CLIENT_IN_PROGRESS,
    }];
    const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setState({ selectedClient: 'irrelevant' });

    // function under test
    const output = wrapper.instance().getClientStatus();

    // expectation
    expect(output).toEqual(mockProps.clients[0].status);
  });
});

describe('method displayPopup()', () => {
  test('clientIntroSeenSession is false', () => {
    // setup
    const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
      disableLifecycleMethods: true
    });

    // function under test
    const output = wrapper.instance().displayPopup();

    // expectation
    expect(output).toEqual(true);
  });

  test('clientIntroSeenSession is true', () => {
    // setup
    mockProps.clientIntroSeenSession = true;
    const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
      disableLifecycleMethods: true
    });

    // function under test
    const output = wrapper.instance().displayPopup();

    // expectation
    expect(output).toEqual(false);
  });

  test('clientIntroSeen is true', () => {
    // setup
    mockProps.clientIntroSeen = true;
    const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
      disableLifecycleMethods: true
    });

    // function under test
    const output = wrapper.instance().displayPopup();

    // expectation
    expect(output).toEqual(true);
  });
});

test('method clearSelectedClient()', () => {
  const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().clearSelectedClient();
  expect(wrapper.instance().state.selectedClient).toBeFalsy();
});

describe('method parseClientData()', () => {
  test('clients already stored to state', () => {
    mockProps.clients = [{}];
    const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().parseClientData();
    expect(mockProps.setAllClients).not.toHaveBeenCalled();
  });

  test('stores the clients to state', () => {
    const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().parseClientData();
    expect(mockProps.setAllClients).toHaveBeenCalledWith(expect.arrayContaining([
      expect.any(String)
    ]));
  });
});

test('method sendPageStatement()', () => {
  // setup
  const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().timeAvailable = new Date();

  // function under test
  wrapper.instance().sendPageStatement();

  // expectation
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'experienced',
    activity: expect.objectContaining({
      id: 'client-proposals',
      type: 'module',
      title: expect.any(String),
      description: expect.any(String)
    }),
    response: expect.objectContaining({
      timeAvailable: expect.any(Date),
      timeResponse: expect.any(Date)
    }),
    parent: '',
    referrer: expect.any(String)
  }));
});

test('method sendStatements()', () => {
  // setup
  const wrapper = shallow(<ProposalsSelector {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().sendLevelStatement = jest.fn();
  wrapper.instance().sendPageStatement = jest.fn();

  // function under test
  wrapper.instance().sendStatements();

  // expectation
  expect(wrapper.instance().sendPageStatement).toHaveBeenCalled();
});

test('should mapStateToProps', () => {
  const state = {
    clientProposalData: {
      clients: []
    },
    genericData: {
      screenReferrer: 'irrelevant'
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    ...state.clientProposalData,
    ...state.genericData
  });
});

test('should mapDispatchToProps', () => {
  const group = 'irrelevant';
  const dispatch = jest.fn();
  jest.spyOn(actions, 'setCurrentHintGroup').mockReturnValue('setCurrentHintGroup()');
  const props = mapDispatchToProps(dispatch);
  props.setCurrentHintGroup(group);
  expect(dispatch).toHaveBeenCalledWith({
    type: types.SET_CURRENT_HINT_GROUP,
    group
  });
});
