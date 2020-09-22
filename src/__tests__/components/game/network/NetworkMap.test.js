/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  NetworkMap,
  mapStateToProps,
  mapDispatchToProps
} from '../../../../components/game/network/NetworkMap';
import * as helper from '../../../../lib/map';
import * as actions from '../../../../actions/generic';
import * as types from '../../../../actions/genericTypes';
import { FAMILY_COMPLETION_STATUS } from '../../../../config/constants';
import { sendInteractionData } from '../../../../tracking/xapi/XApiAdapter';

jest.mock('../../../../tracking/xapi/XApiAdapter');

let mockProps;
beforeEach(() => {
  mockProps = {
    canDisplayIntroPopup: false,
    challenges: [],
    checkStreakStatus: jest.fn(),
    commit: jest.fn(),
    initialiseMapState: jest.fn(),
    mapInitialised: false,
    networkIntroSeen: false,
    networkIntroSeenSession: false,
    perfect: [],
    prepareSuspendData: jest.fn(),
    screenReferrer: 'irrelevant',
    setChallenges: jest.fn(),
    setCurrentHintGroup: jest.fn(),
    setFamilies: jest.fn(),
    setNetworkIntroSeen: jest.fn(),
    setPopupReferrer: jest.fn(),
    setScreenReferrer: jest.fn(),
    suspendData: {}
  };
});

test('renders the NetworkMap component', () => {
  const wrapper = shallow(<NetworkMap {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method componentDidMount', () => {
  // setup
  const wrapper = shallow(<NetworkMap {...mockProps} />, {
    disableLifecycleMethods: true
  });

  // function under test
  wrapper.instance().componentDidMount();

  // expectations
  expect(mockProps.checkStreakStatus).toHaveBeenCalled();
  expect(mockProps.setCurrentHintGroup).toHaveBeenCalledWith(expect.any(String));
  expect(mockProps.setPopupReferrer).toHaveBeenCalledWith(expect.any(String));
});

describe('method componentDidUpdate()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<NetworkMap {...mockProps} />);
  });

  test('map with one completed family', () => {
    // setup
    helper.getStoredFamilies = jest.fn().mockReturnValue([{
      id: 'm1f2',
      status: FAMILY_COMPLETION_STATUS
    }]);
    wrapper.setProps({
      mapInitialised: false
    });

    // function under test
    wrapper.update();

    // expectations
    expect(mockProps.setFamilies).toHaveBeenCalled();
    expect(mockProps.setChallenges).toHaveBeenCalled();
    expect(mockProps.initialiseMapState).toHaveBeenCalledWith(true);
  });

  test('map with an invalid completed family', () => {
    // setup
    helper.getStoredFamilies = jest.fn().mockReturnValue([{
      id: 'foo',
      status: FAMILY_COMPLETION_STATUS
    }]);
    wrapper.setProps({
      mapInitialised: false
    });

    // function under test
    wrapper.update();

    // expectations
    expect(mockProps.setFamilies).toHaveBeenCalled();
    expect(mockProps.setChallenges).toHaveBeenCalled();
    expect(mockProps.initialiseMapState).toHaveBeenCalledWith(true);
  });

  test('map without any completed families', () => {
    // setup
    helper.getStoredFamilies = jest.fn().mockReturnValue([]);
    wrapper.setProps({
      mapInitialised: false
    });

    // function under test
    wrapper.update();

    // expectations
    expect(mockProps.setFamilies).toHaveBeenCalled();
    expect(mockProps.setChallenges).toHaveBeenCalled();
    expect(mockProps.initialiseMapState).toHaveBeenCalledWith(true);
  });

  test('map already initialised', () => {
    // setup
    wrapper.setProps({
      mapInitialised: true
    });

    // function under test
    wrapper.update();

    // expectations
    expect(mockProps.setFamilies).not.toHaveBeenCalled();
    expect(mockProps.setChallenges).not.toHaveBeenCalled();
    expect(mockProps.initialiseMapState).not.toHaveBeenCalled();
  });
});

test('method componentWillUnmount', () => {
  // setup
  const wrapper = shallow(<NetworkMap {...mockProps} />);
  wrapper.instance().sendPageStatement = jest.fn();

  // function under test
  wrapper.instance().componentWillUnmount();

  // expectations
  expect(wrapper.instance().sendPageStatement).toHaveBeenCalled();
  expect(mockProps.setScreenReferrer).toHaveBeenCalledWith(expect.any(String));
});

test('method sendPageStatement()', () => {
  // setup
  const wrapper = shallow(<NetworkMap {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().timeAvailable = new Date();

  // function under test
  wrapper.instance().sendPageStatement();

  // expectations
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'experienced',
    activity: expect.objectContaining({
      id: 'map',
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

test('should mapStateToProps', () => {
  const state = {
    genericData: {
      screenReferrer: 'irrelevant',
    },
    mapData: {
      initialised: false
    },
    scormData: {
      suspendData: {}
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    mapInitialised: state.mapData.initialised,
    screenReferrer: state.genericData.screenReferrer,
    suspendData: state.scormData.suspendData
  });
});

test('should mapDispatchToProps', () => {
  const screen = 'construction';
  const dispatch = jest.fn();
  jest.spyOn(actions, 'changeScreen').mockReturnValue('changeScreen()');
  const props = mapDispatchToProps(dispatch);
  props.changeScreen(screen);
  expect(dispatch).toHaveBeenCalledWith({
    type: types.CHANGE_SCREEN,
    screen
  });
});

describe('method displayPopup()', () => {
  test('networkIntroSeenSession is false', () => {
    // setup
    const wrapper = shallow(<NetworkMap {...mockProps} />, {
      disableLifecycleMethods: true
    });

    // function under test
    const output = wrapper.instance().displayPopup();

    // expectation
    expect(output).toEqual(true);
  });

  test('networkIntroSeenSession is true', () => {
    // setup
    mockProps.networkIntroSeenSession = true;
    const wrapper = shallow(<NetworkMap {...mockProps} />, {
      disableLifecycleMethods: true
    });

    // function under test
    const output = wrapper.instance().displayPopup();

    // expectation
    expect(output).toEqual(false);
  });

  test('networkIntroSeen is true', () => {
    // setup
    mockProps.networkIntroSeen = true;
    const wrapper = shallow(<NetworkMap {...mockProps} />, {
      disableLifecycleMethods: true
    });

    // function under test
    const output = wrapper.instance().displayPopup();

    // expectation
    expect(output).toEqual(true);
  });
});

test('method onClosePopup()', () => {
  // setup
  const wrapper = shallow(<NetworkMap {...mockProps} />, {
    disableLifecycleMethods: true
  });

  // function under test
  wrapper.instance().onClosePopup();

  // expectation
  expect(mockProps.setNetworkIntroSeen).toHaveBeenCalled();
});
