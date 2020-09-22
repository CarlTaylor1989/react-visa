/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  ProductPage,
  mapStateToProps,
  mapDispatchToProps,
  setChallengeIframeRef
} from '../../../../../components/game/network/products/ProductPage';
import * as hintActions from '../../../../../actions/hints';
import * as hintTypes from '../../../../../actions/hintsTypes';
import { sendInteractionData } from '../../../../../tracking/xapi/XApiAdapter';

jest.mock('../../../../../tracking/xapi/XApiAdapter');
jest.useFakeTimers();

let mockProps;
beforeEach(() => {
  mockProps = {
    challenges: [{
      id: 'c1',
      status: 3,
      familyId: 'm1f2'
    }, {
      id: 'c2',
      status: 4,
      familyId: 'm1f2'
    }, {
      id: 'c3',
      status: 1,
      familyId: 'm1f2'
    }],
    checkStreakStatus: jest.fn(),
    challengesCompleted: false,
    commit: jest.fn(),
    currentMap: 'm1',
    currentFamily: 'm1f2',
    currentProduct: 'p4',
    location: '',
    popupReferrer: 'irrelevant',
    prepareSuspendData: jest.fn(),
    productPageViewed: false,
    productPageInactive: false,
    promptsShown: false,
    setProductPageViewedSession: jest.fn(),
    screenReferrer: 'irrelevant',
    setCurrentHintGroup: jest.fn(),
    setPromptsPaused: jest.fn(),
    setHintsPaused: jest.fn(),
    setPopupReferrer: jest.fn(),
    setProductPageInactive: jest.fn(),
    setScreenReferrer: jest.fn(),
  };
  global.window.game = {};
});

test('renders the ProductPage component', () => {
  const wrapper = shallow(<ProductPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method componentDidMount()', () => {
  // setup
  const wrapper = shallow(<ProductPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().setProductPageViewed = jest.fn();
  wrapper.instance().startActivityMonitor = jest.fn();

  // function under test
  wrapper.instance().componentDidMount();

  // expectations
  expect(mockProps.checkStreakStatus).toHaveBeenCalled();
  expect(mockProps.setCurrentHintGroup).toHaveBeenCalledWith(expect.any(String));
  expect(mockProps.setPopupReferrer).toHaveBeenCalledWith(expect.any(String));
  expect(wrapper.instance().setProductPageViewed).toHaveBeenCalled();
  expect(wrapper.instance().startActivityMonitor).toHaveBeenCalled();
});

describe('method componentDidUpdate()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ProductPage {...mockProps} promptsShown />);
    wrapper.instance().setAnimateChallenges = jest.fn();
    wrapper.instance().setState({ pendingChallenges: ['foo'] });
  });

  test('animates lines', () => {
    wrapper.setProps({
      promptsShown: false
    });
    wrapper.update();
    expect(wrapper.instance().setAnimateChallenges).toHaveBeenCalled();
  });

  test('does not animate lines', () => {
    wrapper.setProps({
      promptsShown: true
    });
    wrapper.update();
    expect(wrapper.instance().setAnimateChallenges).not.toHaveBeenCalled();
  });
});

test('method componentWillUnmount()', () => {
  // setup
  const wrapper = shallow(<ProductPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().sendPageStatement = jest.fn();
  wrapper.instance().stopActivityMonitor = jest.fn();

  // function under test
  wrapper.instance().componentWillUnmount();

  // expectations
  expect(wrapper.instance().sendPageStatement).toHaveBeenCalled();
  expect(mockProps.setScreenReferrer).toHaveBeenCalledWith(expect.any(String));
  expect(mockProps.setProductPageInactive).toHaveBeenCalledWith(expect.any(Boolean));
  expect(wrapper.instance().stopActivityMonitor).toHaveBeenCalled();
});

test('method onGoBack()', () => {
  const wrapper = shallow(<ProductPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().onGoBack();
  expect(wrapper.instance().state.forceTooltipHide).toBeTruthy();
});

test('method onOpenLearningPopup()', () => {
  const wrapper = shallow(<ProductPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().onOpenLearningPopup();
  expect(wrapper.instance().state.displayLearningPopup).toBeTruthy();
});

describe('method onExitLearningPopup()', () => {
  test('location triggers tutorial', () => {
    // setup
    mockProps.location = '/game/network/m1f2p1';
    const wrapper = shallow(<ProductPage {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().startActivityMonitor = jest.fn();

    // function under test
    wrapper.instance().onExitLearningPopup();

    // expectations
    expect(wrapper.instance().state.displayLearningPopup).toBeFalsy();
  });

  test('location does not trigger tutorial', () => {
    const wrapper = shallow(<ProductPage {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().startActivityMonitor = jest.fn();
    wrapper.instance().onExitLearningPopup();
    expect(wrapper.instance().state.displayLearningPopup).toBeFalsy();
  });
});

test('method onOpenChallengesPopup()', () => {
  const wrapper = shallow(<ProductPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().onOpenChallengesPopup();
  expect(wrapper.instance().state.displayChalengesPopup).toBeTruthy();
});

test('method onCloseChallengesPopup()', () => {
  // setup
  const wrapper = shallow(<ProductPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().startActivityMonitor = jest.fn();

  // function under test
  wrapper.instance().onCloseChallengesPopup();

  // expectation
  expect(wrapper.instance().state.displayChalengesPopup).toBeFalsy();
});

test('method onModalOpen()', () => {
  // setup
  const wrapper = shallow(<ProductPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().mergeCompleteAnimatedChallenges = jest.fn();

  // function under test
  wrapper.instance().onModalOpen();

  // expectations
  expect(mockProps.setPromptsPaused).toHaveBeenCalledWith(true);
  expect(mockProps.setHintsPaused).toHaveBeenCalledWith(true);
});

test('method onChallengeModalExited()', () => {
  // setup
  const wrapper = shallow(<ProductPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().setState({ completedChallenges: ['irrelevant'] });
  wrapper.instance().onModalExited = jest.fn();
  wrapper.instance().getCompletedChallenges = jest.fn().mockReturnValue(['irrelevant']);

  // function under test
  wrapper.instance().onChallengeModalExited();

  // expectations
  expect(wrapper.instance().onModalExited).toHaveBeenCalled();
  expect(wrapper.instance().state.pendingChallenges).toEqual([]);
});

test('method onModalExited()', () => {
  // setup
  const wrapper = shallow(<ProductPage {...mockProps} />, {
    disableLifecycleMethods: true
  });

  // function under test
  wrapper.instance().onModalExited();

  // expectations
  expect(mockProps.setPromptsPaused).toHaveBeenCalledWith(false);
  expect(mockProps.setHintsPaused).toHaveBeenCalledWith(false);
});

test('method setAnimateChallenges()', () => {
  // setup
  const pendingChallenges = ['foo', 'bar'];
  const wrapper = shallow(<ProductPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().setState({
    pendingChallenges: ['foo', 'bar']
  });

  // function under test
  wrapper.instance().setAnimateChallenges();

  // expectations
  expect(wrapper.instance().state.animateChallenges).toEqual(pendingChallenges);
  expect(wrapper.instance().state.pendingChallenges).toEqual([]);
});

describe('method setChallengeIframeRef()', () => {
  test('fails to set the reference of the element to window', () => {
    setChallengeIframeRef();
    expect(global.window.game.iframeChallengePopup).toBeUndefined();
  });

  test('sets the reference of the element to window', () => {
    const element = { foo: 'bar' };
    setChallengeIframeRef(element);
    expect(global.window.game.iframeChallengePopup).toEqual(element);
  });
});

describe('method mergeCompleteAnimatedChallenges()', () => {
  test('resets the animated challenges', () => {
    // setup
    const wrapper = shallow(<ProductPage {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setState({ animateChallenges: ['foo'] });

    // function under test
    wrapper.instance().mergeCompleteAnimatedChallenges();

    // expectations
    expect(wrapper.instance().state.completedChallenges.length).toEqual(1);
  });

  test('no animated challenges found', () => {
    const wrapper = shallow(<ProductPage {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().mergeCompleteAnimatedChallenges();
    expect(wrapper.instance().state.completedChallenges.length).toEqual(0);
  });
});

test('method sendPageStatement()', () => {
  // setup
  const wrapper = shallow(<ProductPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().timeAvailable = new Date();

  // function under test
  wrapper.instance().sendPageStatement();

  // expectation
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'experienced',
    activity: expect.objectContaining({
      id: expect.stringContaining('product/'),
      type: 'module',
      title: expect.any(String),
      description: expect.any(String)
    }),
    response: expect.objectContaining({
      timeAvailable: expect.any(Date),
      timeResponse: expect.any(Date)
    }),
    parent: 'map',
    referrer: expect.any(String)
  }));
});

describe('method setProductPageViewed()', () => {
  test('setProductPageViewedSession not called', () => {
    // setup
    mockProps.productPageViewed = true;
    const wrapper = shallow(<ProductPage {...mockProps} />, {
      disableLifecycleMethods: true
    });

    // function under test
    wrapper.instance().setProductPageViewed();

    // expectation
    expect(mockProps.setProductPageViewedSession).not.toHaveBeenCalled();
  });

  test('setProductPageViewedSession called', () => {
    // setup
    const wrapper = shallow(<ProductPage {...mockProps} />, {
      disableLifecycleMethods: true
    });

    // function under test
    wrapper.instance().setProductPageViewed();

    // expectation
    expect(mockProps.setProductPageViewedSession).toHaveBeenCalled();
  });
});

describe('method startActivityMonitor()', () => {
  test('set the inactivity time', () => {
    // setup
    const wrapper = shallow(<ProductPage {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().checkInactivity = jest.fn();

    // function under test
    wrapper.instance().startActivityMonitor();
    jest.runOnlyPendingTimers();

    // expectations
    expect(wrapper.instance().inactivityTime).toEqual(expect.any(Date));
    expect(wrapper.instance().checkInactivity).toHaveBeenCalled();
  });

  test('product page is already set to inactive', () => {
    mockProps.productPageInactive = true;
    const wrapper = shallow(<ProductPage {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().startActivityMonitor();
    expect(wrapper.instance().inactivityTime).toBeNull();
  });
});

test('method stopActivityMonitor()', () => {
  // setup
  const wrapper = shallow(<ProductPage {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().inactivityTime = new Date();

  // function under test
  wrapper.instance().stopActivityMonitor();

  // expectation
  expect(wrapper.instance().inactivityTime).toBeNull();
});

describe('method checkInactivity()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ProductPage {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().stopActivityMonitor = jest.fn();
  });

  test('stops the current activity monitor', () => {
    wrapper.instance().inactivityTime = new Date(2019, 8, 1);
    wrapper.instance().checkInactivity();
    expect(wrapper.instance().stopActivityMonitor).toHaveBeenCalled();
  });

  test('hint cannot be shown', () => {
    wrapper.instance().inactivityTime = new Date();
    wrapper.instance().checkInactivity();
    expect(wrapper.instance().stopActivityMonitor).not.toHaveBeenCalled();
  });
});

test('should mapStateToProps', () => {
  // setup
  const state = {
    genericData: {
      screenReferrer: 'irrelevant'
    },
    mapData: {
      completedChallengesSession: true,
      completedChallenges: [],
      currentMap: 'm1',
      currentFamily: 'm1f2',
      currentProduct: 'p4'
    },
    promptsData: {
      show: true
    },
    router: {
      location: {
        pathname: 'irrelevant'
      }
    },
  };

  // function under test
  const props = mapStateToProps(state);

  // expectation
  expect(props).toEqual({
    ...state.genericData,
    location: state.router.location.pathname,
    challengesCompleted: state.mapData.completedChallengesSession,
    currentMap: state.mapData.currentMap,
    currentFamily: state.mapData.currentFamily,
    currentProduct: state.mapData.currentProduct,
    promptsShown: state.promptsData.show
  });
});

describe('should mapDispatchToProps', () => {
  test('method setCurrentHintGroup()', () => {
    // setup
    const group = 'diagnostic';
    const dispatch = jest.fn();
    jest.spyOn(hintActions, 'setCurrentHintGroup').mockReturnValue('setCurrentHintGroup()');
    const props = mapDispatchToProps(dispatch);

    // function under test
    props.setCurrentHintGroup(group);

    // expectation
    expect(dispatch).toHaveBeenCalledWith({
      type: hintTypes.SET_CURRENT_HINT_GROUP,
      group
    });
  });

  test('method setHintsPaused()', () => {
    // setup
    const dispatch = jest.fn();
    jest.spyOn(hintActions, 'setHintsPaused').mockReturnValue('setHintsPaused()');
    const props = mapDispatchToProps(dispatch);

    // function under test
    props.setHintsPaused();

    // expectation
    expect(dispatch).toHaveBeenCalledWith({
      type: hintTypes.SET_HINTS_PAUSED
    });
  });
});
