/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  ChallengeNavigator,
  mapStateToProps,
  mapDispatchToProps
} from '../../../../components/generic/iframepopup/ChallengeNavigator';
import * as actions from '../../../../actions/map';
import * as types from '../../../../actions/mapTypes';
import * as map from '../../../../lib/map';
import {
  CHALLENGE_PERFECT_STATUS,
  CHALLENGE_COMPLETION_STATUS,
  CHALLENGE_FAILED_STATUS,
  CHALLENGE_IN_PROGRESS_STATUS,
  FAMILY_COMPLETION_STATUS,
  SCO_COMPLETION_PASSED,
  SCO_COMPLETION_FAILED,
  SCO_COMPLETION_UNKNOWN
} from '../../../../config/constants';
import { sendInteractionData } from '../../../../tracking/xapi/XApiAdapter';

jest.mock('../../../../lib/map');
jest.mock('../../../../tracking/xapi/XApiAdapter');

let mockProps;
beforeEach(() => {
  mockProps = {
    active: false,
    challenges: [],
    closeChallengesPopupCallback: jest.fn(),
    currentFamily: '',
    currentProduct: '',
    increaseChallengesCompleted: jest.fn(),
    increasePerfectBonus: jest.fn(),
    increaseProductsCompleted: jest.fn(),
    increaseScore: jest.fn(),
    increaseStreak: jest.fn(),
    onGomoCourseOpened: jest.fn(),
    popupReferrer: 'irrelevant',
    resetStreakProgress: jest.fn(),
    setIframeSrc: jest.fn(),
    setLastChallengesModified: jest.fn(),
    setLastProductCompleted: jest.fn(),
    setPlayAudio: jest.fn(),
    streak: 0,
    updateChallengeStatus: jest.fn(),
    updateFamilyStatus: jest.fn()
  };
});

test('renders the ChallengeNavigator component', () => {
  const wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
    disableLifecycleMethods: true
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidMount()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().getProductChallenges = jest.fn().mockReturnValue([{
      id: 'c1', status: 1, familyId: 'irrelevant'
    }, {
      id: 'c2', status: 2, familyId: 'irrelevant'
    }, {
      id: 'c3', status: 3, familyId: 'irrelevant', isFinal: true
    }]);
    map.findChallengeInChallenges.mockImplementation(() => ({
      link: 'irrelevant',
      children: []
    }));
  });

  test('next is locked - challenge is not completed', () => {
    map.getNextChallengeIndex.mockImplementation(() => 0);
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().state).toEqual(expect.objectContaining({
      challenges: expect.any(Array),
      challengeChildren: expect.any(Array),
      isNextUnlocked: false,
      selectedIndex: expect.any(Number),
      statuses: expect.any(Object)
    }));
  });

  test('next is locked - last challenge', () => {
    map.getNextChallengeIndex.mockImplementation(() => 2);
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().state).toEqual(expect.objectContaining({
      challenges: expect.any(Array),
      challengeChildren: expect.any(Array),
      isNextUnlocked: false,
      selectedIndex: expect.any(Number),
      statuses: expect.any(Object)
    }));
  });

  test('next is unlocked', () => {
    map.getNextChallengeIndex.mockImplementation(() => 1);
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().state).toEqual(expect.objectContaining({
      challenges: expect.any(Array),
      challengeChildren: expect.any(Array),
      isNextUnlocked: false,
      selectedIndex: expect.any(Number),
      statuses: expect.any(Object)
    }));
  });
});

describe('method onCloseResetStreakPopup()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setNextChallenge = jest.fn();
    wrapper.instance().sendChallengeStatement = jest.fn();
  });

  test('reset streak true', () => {
    // setup
    wrapper.instance().setState({
      challenges: [{
        id: 'c1', status: 1, familyId: 'irrelevant'
      }],
      statuses: {
        c1: 1
      },
      selectedIndex: 0
    });

    // function under test
    wrapper.instance().onCloseResetStreakPopup(true);

    // expectations
    expect(mockProps.updateChallengeStatus).toHaveBeenCalled();
    expect(mockProps.resetStreakProgress).toHaveBeenCalled();
  });

  test('reset streak true and nextIndex set', () => {
    // setup
    wrapper.instance().setState({
      challenges: [{
        id: 'c1', status: 1, familyId: 'irrelevant'
      }],
      statuses: {
        c1: 1
      },
      selectedIndex: 0,
      nextIndex: 1
    });

    // function under test
    wrapper.instance().onCloseResetStreakPopup(true);

    // expectations
    expect(wrapper.instance().setNextChallenge).toHaveBeenCalled();
  });

  test('reset streak true and closeChallengesPopup set', () => {
    // setup
    wrapper.instance().setState({
      challenges: [{
        id: 'c1', status: 1, familyId: 'irrelevant'
      }],
      statuses: {
        c1: 1
      },
      selectedIndex: 0,
      closeChallengesPopup: true
    });

    // function under test
    wrapper.instance().onCloseResetStreakPopup(true);

    // expectations
    expect(mockProps.closeChallengesPopupCallback).toHaveBeenCalled();
  });

  test('reset streak false', () => {
    // setup
    wrapper.instance().setState({
      challenges: [{
        id: 'c1', status: 1, familyId: 'irrelevant'
      }],
      statuses: {
        c1: 1
      },
      selectedIndex: 0
    });

    // function under test
    wrapper.instance().onCloseResetStreakPopup(false);

    // expectations
    expect(wrapper.instance().state).toEqual(expect.objectContaining({
      displayResetStreak: false,
      nextIndex: null
    }));
  });
});

describe('method onChangeChallenge()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setState({
      challenges: [{
        id: 'c1', status: 1, familyId: 'irrelevant'
      }, {
        id: 'c2', status: 3, familyId: 'irrelevant'
      }, {
        id: 'c3', status: -1, familyId: 'irrelevant'
      }, {
        id: 'c4', status: -1, familyId: 'irrelevant'
      }],
      statuses: {
        c1: 1,
        c2: 3,
        c3: -1,
        c4: -1
      }
    });
    map.findChallengeInChallenges.mockImplementation(() => ({
      link: 'irrelevant',
      children: []
    }));
  });

  test('iframe source not set', () => {
    wrapper.instance().onChangeChallenge(0);
    expect(mockProps.setIframeSrc).not.toHaveBeenCalled();
  });

  test('iframe source set and next is unlocked', () => {
    // setup
    const index = 1;

    // function under test
    wrapper.instance().onChangeChallenge(index);

    // expectations
    expect(mockProps.setIframeSrc).toHaveBeenCalledWith(expect.any(String));
    expect(wrapper.instance().state).toEqual(expect.objectContaining({
      challengeChildren: expect.any(Array),
      isNextUnlocked: true,
      selectedIndex: index
    }));
  });

  test('iframe source set and next is locked', () => {
    // setup
    const index = 2;

    // function under test
    wrapper.instance().onChangeChallenge(index);

    // expectations
    expect(mockProps.setIframeSrc).toHaveBeenCalledWith(expect.any(String));
    expect(wrapper.instance().state).toEqual(expect.objectContaining({
      challengeChildren: expect.any(Array),
      isNextUnlocked: false,
      selectedIndex: index
    }));
  });

  test('display reset streak state set', () => {
    // setup
    mockProps.active = true;
    mockProps.streak = 1;
    wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setState({
      challenges: [{
        id: 'c1', status: 1, familyId: 'irrelevant'
      }, {
        id: 'c2', status: 2, familyId: 'irrelevant'
      }],
      statuses: {
        c1: 1,
        c2: 2
      },
      selectedIndex: 0
    });
    const index = 1;
    wrapper.instance().setState = jest.fn();

    // function under test
    wrapper.instance().onChangeChallenge(index);

    // expectations
    expect(wrapper.instance().setState)
      .toHaveBeenCalledWith({ displayResetStreak: true, nextIndex: index });
  });
});

describe('method onExitChallenges()', () => {
  test('displays reset streak', () => {
    // setup
    mockProps.active = true;
    mockProps.streak = 1;
    const wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setState({
      challenges: [{
        id: 'c1', status: 1, familyId: 'irrelevant'
      }, {
        id: 'c2', status: 2, familyId: 'irrelevant'
      }],
      statuses: {
        c1: 1,
        c2: 2
      },
      selectedIndex: 0
    });
    wrapper.instance().setState = jest.fn();

    // function under test
    wrapper.instance().onExitChallenges();

    // expectations
    expect(wrapper.instance().setState)
      .toHaveBeenCalledWith({
        displayResetStreak: true,
        closeChallengesPopup: true
      });
  });

  test("doesn't reset streak", () => {
    // setup
    const wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setState({
      challenges: [{
        id: 'c1', status: 1, familyId: 'irrelevant'
      }, {
        id: 'c2', status: 2, familyId: 'irrelevant'
      }],
      statuses: {
        c1: 1,
        c2: 2
      },
      selectedIndex: 0
    });
    wrapper.instance().setState = jest.fn();

    // function under test
    wrapper.instance().onExitChallenges();

    // expectations
    expect(wrapper.instance().setState).not.toHaveBeenCalledWith();
  });
});

test('method onNextChallenge()', () => {
  // setup
  const selectedIndex = 2;
  const wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().onChangeChallenge = jest.fn();
  wrapper.instance().setState({ selectedIndex });

  // function under test
  wrapper.instance().onNextChallenge();

  // expectations
  expect(wrapper.instance().onChangeChallenge).toHaveBeenCalledWith(selectedIndex + 1);
});

test('method onPreviousChallenge()', () => {
  // setup
  const selectedIndex = 2;
  const wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().onChangeChallenge = jest.fn();
  wrapper.instance().setState({ selectedIndex });

  // function under test
  wrapper.instance().onPreviousChallenge();

  // expectations
  expect(wrapper.instance().onChangeChallenge).toHaveBeenCalledWith(selectedIndex - 1);
});

describe('method setNextChallenge()', () => {
  test('nextIndex not set', () => {
    // setup
    const wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setState({
      challenges: [{
        id: 'c1', status: 4, familyId: 'irrelevant'
      }, {
        id: 'c2', status: 4, familyId: 'irrelevant'
      }],
      statuses: {
        c1: 4,
        c2: 4
      },
      nextIndex: null
    });
    wrapper.instance().setState = jest.fn();

    // function under test
    wrapper.instance().setNextChallenge(0);

    // expectations
    expect(wrapper.instance().setState)
      .toHaveBeenCalledWith(expect.objectContaining({ selectedIndex: 0 }));
  });

  test('nextIndex set', () => {
    // setup
    const wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setState({
      challenges: [{
        id: 'c1', status: 4, familyId: 'irrelevant'
      }, {
        id: 'c2', status: 4, familyId: 'irrelevant'
      }],
      statuses: {
        c1: 4,
        c2: 4
      },
      nextIndex: 1
    });
    wrapper.instance().setState = jest.fn();

    // function under test
    wrapper.instance().setNextChallenge(0);

    // expectations
    expect(wrapper.instance().setState)
      .toHaveBeenCalledWith(expect.objectContaining({ selectedIndex: 1 }));
  });
});

test('method getProductChallenges()', () => {
  // setup
  mockProps.currentFamily = 'm1f2';
  mockProps.currentProduct = 'p2';
  mockProps.challenges = [{
    id: 'c1',
    familyId: 'm1f1',
    productId: mockProps.currentProduct,
    status: CHALLENGE_FAILED_STATUS,
    isFinal: false
  }, {
    id: 'c2',
    familyId: mockProps.currentFamily,
    productId: mockProps.currentProduct,
    status: CHALLENGE_FAILED_STATUS,
    isFinal: true
  }];
  const wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
    disableLifecycleMethods: true
  });

  // function under test
  const output = wrapper.instance().getProductChallenges();

  // expectations
  expect(output.length).toEqual(1);
  expect(output).toEqual(expect.arrayContaining([expect.objectContaining({
    id: expect.any(String),
    familyId: mockProps.currentFamily,
    productId: mockProps.currentProduct,
    status: expect.any(Number),
    isFinal: expect.any(Boolean)
  })]));
});

describe('method setChallengeSore()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setState({
      statuses: {
        c1: 3,
        c2: 4,
        c3: 2,
        c4: -1
      }
    });
  });

  test('score not set', () => {
    wrapper.instance().setChallengeSore(false, CHALLENGE_COMPLETION_STATUS, 'c1', false);
    expect(mockProps.increaseScore).not.toHaveBeenCalled();
  });

  test('sets the score to a perfect challenge', () => {
    wrapper.instance().setChallengeSore(true, CHALLENGE_PERFECT_STATUS, 'c1', false);
    expect(mockProps.increasePerfectBonus).toHaveBeenCalled();
    expect(mockProps.increaseScore).toHaveBeenCalledWith(expect.any(Number));
  });

  test('sets the score to a completed and final challenge', () => {
    wrapper.instance().setChallengeSore(true, CHALLENGE_COMPLETION_STATUS, 'c3', true);
    expect(mockProps.increaseChallengesCompleted).toHaveBeenCalled();
    expect(mockProps.increaseScore).toHaveBeenCalledWith(expect.any(Number));
  });
});

describe('method updateChallengeData()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setChallengeSore = jest.fn();
    wrapper.instance().completeFamily = jest.fn();
    wrapper.instance().sendChallengeStatement = jest.fn();
  });

  test('challenge completed', () => {
    // setup
    map.determineChallengeStatus.mockImplementation(() => CHALLENGE_COMPLETION_STATUS);
    wrapper.instance().setState({
      challenges: [{
        id: 'c1', status: 3, familyId: 'irrelevant'
      }, {
        id: 'c2', status: 1, familyId: 'irrelevant'
      }, {
        id: 'c3', status: -1, familyId: 'irrelevant'
      }, {
        id: 'c4', status: -1, familyId: 'irrelevant'
      }],
      statuses: {
        c1: 1,
        c2: 1,
        c3: -1,
        c4: -1
      },
      challengeChildren: ['c2']
    });

    // function under test
    wrapper.instance().updateChallengeData({
      success: SCO_COMPLETION_PASSED
    }, 90);

    // expectations
    expect(mockProps.updateChallengeStatus).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      CHALLENGE_COMPLETION_STATUS
    );
    expect(mockProps.updateChallengeStatus).toHaveBeenCalledTimes(2);
    expect(mockProps.resetStreakProgress).not.toHaveBeenCalled();
    expect(wrapper.instance().setChallengeSore).toHaveBeenCalled();
    expect(mockProps.setLastChallengesModified).toHaveBeenCalled();
    expect(wrapper.instance().state.isNextUnlocked).toBeTruthy();
  });

  test('challenge failed', () => {
    // setup
    map.determineChallengeStatus.mockImplementation(() => CHALLENGE_FAILED_STATUS);
    wrapper.instance().setState({
      challenges: [{
        id: 'c1', status: 1, familyId: 'irrelevant'
      }, {
        id: 'c2', status: -1, familyId: 'irrelevant'
      }, {
        id: 'c3', status: -1, familyId: 'irrelevant'
      }, {
        id: 'c4', status: -1, familyId: 'irrelevant'
      }],
      statuses: {
        c1: 1,
        c2: -1,
        c3: -1,
        c4: -1
      },
      challengeChildren: ['c2']
    });

    // function under test
    wrapper.instance().updateChallengeData({
      success: SCO_COMPLETION_FAILED
    }, 20);

    // expectations
    expect(mockProps.updateChallengeStatus).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      CHALLENGE_FAILED_STATUS
    );
    expect(mockProps.updateChallengeStatus).toHaveBeenCalledTimes(1);
    expect(mockProps.resetStreakProgress).toHaveBeenCalled();
    expect(mockProps.increaseStreak).not.toHaveBeenCalled();
    expect(mockProps.setLastChallengesModified).toHaveBeenCalled();
    expect(wrapper.instance().state.isNextUnlocked).toBeFalsy();
  });

  test('challenge in progress', () => {
    // setup
    map.determineChallengeStatus.mockImplementation(() => CHALLENGE_IN_PROGRESS_STATUS);
    wrapper.instance().setState({
      challenges: [{
        id: 'c1', status: 0, familyId: 'irrelevant'
      }, {
        id: 'c2', status: -1, familyId: 'irrelevant'
      }, {
        id: 'c3', status: -1, familyId: 'irrelevant'
      }, {
        id: 'c4', status: -1, familyId: 'irrelevant'
      }],
      statuses: {
        c1: 0,
        c2: -1,
        c3: -1,
        c4: -1
      },
      challengeChildren: ['c2']
    });

    // function under test
    wrapper.instance().updateChallengeData({
      success: SCO_COMPLETION_UNKNOWN
    }, 0);

    // expectations
    expect(mockProps.updateChallengeStatus).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      CHALLENGE_IN_PROGRESS_STATUS
    );
    expect(mockProps.updateChallengeStatus).toHaveBeenCalledTimes(1);
    expect(mockProps.resetStreakProgress).not.toHaveBeenCalled();
    expect(mockProps.increaseStreak).not.toHaveBeenCalled();
    expect(mockProps.setLastChallengesModified).toHaveBeenCalled();
    expect(wrapper.instance().state.isNextUnlocked).toBeFalsy();
  });

  test('challenge was marked as perfect and now is completed', () => {
    // setup
    map.determineChallengeStatus.mockImplementation(() => CHALLENGE_COMPLETION_STATUS);
    wrapper.instance().setState({
      challenges: [{
        id: 'c1', status: 4, familyId: 'irrelevant'
      }, {
        id: 'c2', status: 1, familyId: 'irrelevant'
      }, {
        id: 'c3', status: -1, familyId: 'irrelevant'
      }, {
        id: 'c4', status: -1, familyId: 'irrelevant'
      }],
      statuses: {
        c1: 4,
        c2: 1,
        c3: -1,
        c4: -1
      },
      challengeChildren: ['c2']
    });

    // function under test
    wrapper.instance().updateChallengeData({
      success: SCO_COMPLETION_PASSED
    }, 90);

    // expectations
    expect(mockProps.updateChallengeStatus).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      CHALLENGE_COMPLETION_STATUS
    );
    expect(mockProps.updateChallengeStatus).toHaveBeenCalledTimes(1);
    expect(mockProps.setLastChallengesModified).toHaveBeenCalled();
    expect(wrapper.instance().state.isNextUnlocked).toBeTruthy();
  });

  test('next challenge was not started', () => {
    // setup
    map.determineChallengeStatus.mockImplementation(() => CHALLENGE_PERFECT_STATUS);
    wrapper.instance().setState({
      challenges: [{
        id: 'c1', status: 3, familyId: 'irrelevant'
      }, {
        id: 'c2', status: -1, familyId: 'irrelevant'
      }, {
        id: 'c3', status: -1, familyId: 'irrelevant'
      }, {
        id: 'c4', status: -1, familyId: 'irrelevant'
      }],
      statuses: {
        c1: 3,
        c2: -1,
        c3: -1,
        c4: -1
      },
      challengeChildren: ['c2']
    });

    // function under test
    wrapper.instance().updateChallengeData({
      success: SCO_COMPLETION_PASSED
    }, 100);

    // expectations
    expect(mockProps.updateChallengeStatus).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      CHALLENGE_PERFECT_STATUS
    );
    expect(mockProps.updateChallengeStatus).toHaveBeenCalledTimes(2);
    expect(mockProps.setLastChallengesModified).toHaveBeenCalled();
    expect(wrapper.instance().state.isNextUnlocked).toBeTruthy();
  });

  test('last challenge is completed for first time', () => {
    // setup
    map.determineChallengeStatus.mockImplementation(() => CHALLENGE_COMPLETION_STATUS);
    wrapper.instance().setState({
      challenges: [{
        id: 'c1',
        status: 2,
        familyId: 'irrelevant',
        productId: 'p1',
        isFinal: true
      }],
      statuses: {
        c1: 2
      }
    });

    // function under test
    wrapper.instance().updateChallengeData({
      success: SCO_COMPLETION_PASSED
    }, 90);

    // expectation
    expect(mockProps.increaseProductsCompleted).toHaveBeenCalled();
    expect(mockProps.setLastProductCompleted).toHaveBeenCalledWith(expect.any(String));
    expect(wrapper.instance().completeFamily).toHaveBeenCalled();
  });

  test('last challenge is marked as perfect after it was completed', () => {
    // setup
    map.determineChallengeStatus.mockImplementation(() => CHALLENGE_PERFECT_STATUS);
    wrapper.instance().setState({
      challenges: [{
        id: 'c1',
        status: 2,
        familyId: 'irrelevant',
        productId: 'p1',
        isFinal: true
      }],
      statuses: {
        c1: 3
      }
    });

    // function under test
    wrapper.instance().updateChallengeData({
      success: CHALLENGE_PERFECT_STATUS
    }, 100);

    // expectation
    expect(mockProps.increaseProductsCompleted).not.toHaveBeenCalled();
    expect(mockProps.setLastProductCompleted).toHaveBeenCalledWith(expect.any(String));
    expect(wrapper.instance().completeFamily).toHaveBeenCalled();
  });

  test('last challenge is marked as perfect', () => {
    // setup
    map.determineChallengeStatus.mockImplementation(() => CHALLENGE_PERFECT_STATUS);
    wrapper.instance().setState({
      challenges: [{
        id: 'c1',
        status: 2,
        familyId: 'irrelevant',
        productId: 'p1',
        isFinal: true
      }],
      statuses: {
        c1: 2
      }
    });

    // function under test
    wrapper.instance().updateChallengeData({
      success: SCO_COMPLETION_PASSED
    }, 100);

    // expectation
    expect(mockProps.setLastProductCompleted).toHaveBeenCalledWith(expect.any(String));
    expect(wrapper.instance().completeFamily).toHaveBeenCalled();
  });
});

describe('method completeFamily()', () => {
  test('family not completed', () => {
    // setup
    const familyId = 'm1f1';
    mockProps.challenges = [{
      id: 'c1',
      familyId,
      productId: 'p1',
      status: CHALLENGE_FAILED_STATUS,
      isFinal: true
    }];
    const wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
      disableLifecycleMethods: true
    });

    // function under test
    wrapper.instance().completeFamily(familyId);

    // expectation
    expect(mockProps.updateFamilyStatus).not.toHaveBeenCalled();
  });

  test('family completed', () => {
    // setup
    const familyId = 'm1f1';
    mockProps.challenges = [{
      id: 'c1',
      familyId,
      status: CHALLENGE_COMPLETION_STATUS,
      isFinal: true
    }];
    const wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
      disableLifecycleMethods: true
    });

    // function under test
    wrapper.instance().completeFamily(familyId);

    // expectation
    expect(mockProps.updateFamilyStatus).toHaveBeenCalledWith(familyId, FAMILY_COMPLETION_STATUS);
  });
});

test('method sendChallengeStatement()', () => {
  // setup
  map.getChallengeXAPIStatus.mockImplementation(() => ({
    response: 'irrelevant',
    score: 1,
    success: true
  }));
  const wrapper = shallow(<ChallengeNavigator {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().timeAvailable = new Date();

  // function under test
  wrapper.instance().sendChallengeStatement(1);

  // expectation
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'completed',
    activity: expect.objectContaining({
      id: expect.any(String),
      type: 'course',
      title: expect.any(String),
      description: expect.any(String),
      gomoCourse: true
    }),
    result: expect.objectContaining({
      success: expect.any(Boolean),
      score: expect.objectContaining({
        raw: expect.any(Number),
        min: expect.any(Number),
        max: expect.any(Number)
      })
    }),
    response: expect.objectContaining({
      detail: expect.any(String),
      timeAvailable: expect.any(Date),
      timeResponse: expect.any(Date)
    }),
    parent: expect.any(String)
  }));
});

test('should mapStateToProps', () => {
  const state = {
    genericData: {
      popupReferrer: 'irrelevant'
    },
    mapData: {
      challenges: [],
      currentFamily: 'foo',
      currentProduct: 'bar'
    },
    streakData: {
      active: false,
      progress: 0
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    ...state.genericData,
    ...state.mapData,
    active: false,
    streak: 0
  });
});

test('should mapDispatchToProps', () => {
  const lastChallengesModified = ['c1'];
  const dispatch = jest.fn();
  jest.spyOn(actions, 'setLastChallengesModified').mockReturnValue('setLastChallengesModified()');
  const props = mapDispatchToProps(dispatch);
  props.setLastChallengesModified(lastChallengesModified);
  expect(dispatch).toHaveBeenCalledWith({
    type: types.SET_LAST_CHALLENGES_MODIFIED,
    lastChallengesModified
  });
});
