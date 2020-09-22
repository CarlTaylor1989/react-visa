/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import { cloneDeep } from 'lodash';
import {
  Hints,
  mapStateToProps,
  mapDispatchToProps
} from '../../../../components/generic/hints/Hints';
import * as actions from '../../../../actions/hints';
import * as types from '../../../../actions/hintsTypes';
import { initialState as hintsInitialState } from '../../../../reducers/hints';
import { initialState as mapInitialState } from '../../../../reducers/map';
import { initialState as streakInitialState } from '../../../../reducers/streak';
import { initialState as genericInitialState } from '../../../../reducers/generic';
import { initialState as clientProposalIinitialState } from '../../../../reducers/clients';
import {
  getHintId,
  getHintIndexFromState,
  getNextHintIndex,
  hintAccessible
} from '../../../../lib/hints';

jest.useFakeTimers();

jest.mock('../../../../lib/hints');

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    bonusStreak: streakInitialState.progress,
    clients: clientProposalIinitialState.clients,
    clientShowing: clientProposalIinitialState.clientShowing,
    displayReqFeedback: clientProposalIinitialState.displayReqFeedback,
    currentGroup: hintsInitialState.currentGroup,
    completedChallenges: mapInitialState.completedChallenges,
    completedProducts: mapInitialState.completedProducts,
    hints: hintsInitialState.hints,
    paused: hintsInitialState.paused,
    productPageInactive: false,
    setHintGroupIndex: jest.fn()
  };
});

test('renders Hints component', () => {
  const wrapper = shallow(<Hints {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidMount()', () => {
  test('setHint() called', () => {
    // setup
    const wrapper = shallow(<Hints {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().setHint = jest.fn();

    // function under test
    wrapper.instance().componentDidMount();

    // expectation
    expect(wrapper.instance().setHint).toHaveBeenCalled();
  });

  test('timer is called', () => {
    // setup
    const wrapper = shallow(<Hints {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().setHint = jest.fn();
    wrapper.instance().componentDidMount();
    jest.runOnlyPendingTimers();

    // expectation
    expect(wrapper.instance().setHint).toHaveBeenCalled();
  });
});

describe('method componentDidUpdate()', () => {
  test('method setHint() is not called', () => {
    // setup
    mockProps.paused = true;
    const wrapper = shallow(<Hints {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().setHint = jest.fn();

    // function under test
    wrapper.instance().componentDidUpdate(mockProps);

    // expectation
    expect(wrapper.instance().setHint).not.toHaveBeenCalled();
  });

  test('method setHint() is called after unpaused or different hint group', () => {
    // setup
    const previousProps = cloneDeep(mockProps);
    previousProps.paused = true;
    mockProps.paused = false;
    const wrapper = shallow(<Hints {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().setHint = jest.fn();

    // function under test
    wrapper.instance().componentDidUpdate(previousProps);

    // expectation
    expect(wrapper.instance().setHint).toHaveBeenCalled();
  });

  test(`method setNextHint() is called after the hint group
  is changed from an existing one`, () => {
    // setup
    const previousProps = cloneDeep(mockProps);
    previousProps.currentGroup = 'diagnostic';
    mockProps.paused = false;
    mockProps.currentGroup = 'proposal';
    const wrapper = shallow(<Hints {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().setNextHint = jest.fn();

    // function under test
    wrapper.instance().componentDidUpdate(previousProps);

    // expectation
    expect(wrapper.instance().setNextHint).toHaveBeenCalled();
  });

  test('method setNextHint() is called when completedChallenge is changed', () => {
    // setup
    mockProps.currentGroup = 'network';
    const previousProps = cloneDeep(mockProps);
    mockProps.completedChallenges = ['one'];
    getHintId.mockImplementation(() => 'h2');
    getHintIndexFromState.mockImplementation(() => 0);
    const wrapper = shallow(<Hints {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().setNextHint = jest.fn();

    // function under test
    wrapper.instance().componentDidUpdate(previousProps);

    // expectation
    expect(wrapper.instance().setNextHint).toHaveBeenCalled();
  });

  test('method setNextHint() is called when completedProducts is changed', () => {
    // setup
    mockProps.currentGroup = 'network';
    const previousProps = cloneDeep(mockProps);
    mockProps.completedProducts = ['one'];
    getHintId.mockImplementation(() => 'h2');
    getHintIndexFromState.mockImplementation(() => 0);
    const wrapper = shallow(<Hints {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().setNextHint = jest.fn();

    // function under test
    wrapper.instance().componentDidUpdate(previousProps);

    // expectation
    expect(wrapper.instance().setNextHint).toHaveBeenCalled();
  });
});

test('clearInterval() called from method componentWillUnmount()', () => {
  const wrapper = shallow(<Hints {...mockProps} />, {
    disableLifecycleMethods: true,
  });
  wrapper.instance().componentWillUnmount();
  expect(clearInterval).toHaveBeenCalled();
});

describe('function setHint()', () => {
  test('hintAccessible() returns true for accessible hint', () => {
    // setup
    const proposal = 'h12';
    mockProps.currentGroup = 'proposal';
    getHintIndexFromState.mockImplementation(() => 0);
    getHintId.mockImplementation(() => proposal);
    hintAccessible.mockImplementation(() => true);
    const wrapper = shallow(<Hints {...mockProps} />);

    // function under test
    wrapper.instance().setHint();

    // expectation
    expect(wrapper.instance().state.hintId).toEqual(proposal);
  });

  test('hintAccessible() returns false for accessible hint', () => {
    // setup
    const proposal = '';
    mockProps.currentGroup = 'proposal';
    getHintIndexFromState.mockImplementation(() => 0);
    getHintId.mockImplementation(() => null);
    hintAccessible.mockImplementation(() => false);
    const wrapper = shallow(<Hints {...mockProps} />);

    // function under test
    wrapper.instance().setHint();

    // expectation
    expect(wrapper.instance().state.hintId).toEqual(proposal);
  });
});

describe('method setNextHint()', () => {
  test('function getHintIndexFromState() called for diagnostic', () => {
    // setup
    mockProps.currentGroup = 'diagnostic';
    const wrapper = shallow(<Hints {...mockProps} />);

    // function under test
    wrapper.instance().setNextHint();

    // expectation
    expect(getHintIndexFromState).toHaveBeenCalledWith(
      mockProps.hints,
      mockProps.currentGroup
    );
  });

  test('function getNextHintIndex() called', () => {
    // setup
    mockProps.currentGroup = 'proposal';
    const wrapper = shallow(<Hints {...mockProps} />);
    getHintIndexFromState.mockImplementation(() => 1);

    // function under test
    wrapper.instance().setNextHint();

    // expectation
    expect(getNextHintIndex).toHaveBeenCalled();
  });

  test('function getNextHintIndex() not called', () => {
    // setup
    mockProps.currentGroup = 'proposal';
    const wrapper = shallow(<Hints {...mockProps} />);
    getHintIndexFromState.mockImplementation(() => null);

    // function under test
    wrapper.instance().setNextHint();

    // expectation
    expect(getNextHintIndex).not.toHaveBeenCalled();
  });

  test('function setHintGroupIndex() called', () => {
    // setup
    mockProps.currentGroup = 'proposal';
    const wrapper = shallow(<Hints {...mockProps} />);
    getHintIndexFromState.mockImplementation(() => 2);
    getNextHintIndex.mockImplementation(() => 3);

    // function under test
    wrapper.instance().setNextHint();

    // expectation
    expect(mockProps.setHintGroupIndex).toHaveBeenCalled();
  });
});

test('should mapStateToProps', () => {
  const state = {
    clientProposalData: clientProposalIinitialState,
    hintsData: hintsInitialState,
    mapData: mapInitialState,
    streakData: streakInitialState,
    genericData: genericInitialState
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    currentGroup: state.hintsData.currentGroup,
    paused: state.hintsData.paused,
    hints: state.hintsData.hints,
    clients: state.clientProposalData.clients,
    clientShowing: state.clientProposalData.clientShowing,
    displayReqFeedback: state.clientProposalData.displayReqFeedback,
    completedChallenges: state.mapData.completedChallenges,
    completedProducts: state.mapData.completedProducts,
    bonusStreak: state.streakData.progress,
    productPageInactive: state.genericData.productPageInactive
  });
});

test('should mapDispatchToProps', () => {
  // setup
  const dispatch = jest.fn();
  const hints = { group: 'proposal', index: 1 };
  jest.spyOn(actions, 'setHintGroupIndex').mockReturnValue('setHintGroupIndex()');
  const props = mapDispatchToProps(dispatch);

  // function under test
  props.setHintGroupIndex(hints);

  // expectation
  expect(dispatch).toHaveBeenCalledWith({
    type: types.SET_HINT_GROUP_INDEX,
    hints
  });
});
