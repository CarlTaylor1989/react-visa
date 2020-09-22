/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import { LoadingNav, mapStateToProps } from '../../../components/loadingnav/LoadingNav';
import * as xapi from '../../../tracking/xapi/XApiAdapter';
import { hideLoader } from '../../../lib/app';

jest.mock('../../../components/generic/GoToScreen');
jest.mock('../../../tracking/xapi/XApiAdapter');
jest.mock('../../../lib/app');

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    addPrompts: jest.fn(),
    dataReady: false,
    learnerID: '',
    learnerName: '',
    lessonLocation: '/',
    restoreAchievements: jest.fn(),
    setCategories: jest.fn(),
    setDiagnosticData: jest.fn(),
    setGenericData: jest.fn(),
    setRank: jest.fn(),
    setScreenReferrer: jest.fn(),
    setSettings: jest.fn(),
    setScores: jest.fn(),
    setSlideIndex: jest.fn(),
    setStreak: jest.fn(),
    suspendData: {},
    suspendDataParsed: jest.fn(),
    updateTimedAchievements: jest.fn(),
    scormInitialised: false,
    setClientProposalData: jest.fn(),
    setTutorialLaunched: jest.fn()
  };
});

test('renders the LoadingNav component in prod mode', () => {
  const wrapper = shallow(<LoadingNav {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidMount', () => {
  test('renders the LoadingNav component in dev mode', () => {
    // setup
    const wrapper = shallow(<LoadingNav {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().findAndGoToScreen = jest.fn();
    global.process.env.PLATFORM = 'local';

    // function under test
    wrapper.instance().componentDidMount();

    // expectation
    expect(wrapper.instance().findAndGoToScreen).toHaveBeenCalled();
  });

  test('renders the LoadingNav component in production mode with scorm adapter initialised', () => {
    // setup
    mockProps.scormInitialised = true;
    const wrapper = shallow(<LoadingNav {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().onScormReady = jest.fn();
    global.process.env.PLATFORM = 'production';

    // function under test
    wrapper.instance().componentDidMount();

    // expectation
    expect(wrapper.instance().onScormReady).toHaveBeenCalled();
  });

  test('renders the LoadingNav component in production mode with scorm adapter not initialised', () => { // eslint-disable-line max-len
    // setup
    const wrapper = shallow(<LoadingNav {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().findAndGoToScreen = jest.fn();
    wrapper.instance().onScormReady = jest.fn();
    global.process.env.PLATFORM = 'production';

    // function under test
    wrapper.instance().componentDidMount();

    // expectation
    expect(wrapper.instance().findAndGoToScreen).not.toHaveBeenCalled();
    expect(wrapper.instance().onScormReady).not.toHaveBeenCalled();
  });
});

describe('LoadingNav component did update', () => {
  test('scorm is initialised', () => {
    // setup
    const wrapper = shallow(<LoadingNav {...mockProps} />);
    wrapper.instance().onScormReady = jest.fn();
    wrapper.setProps({ scormInitialised: true });

    // function under test
    wrapper.update();

    // expectations
    expect(wrapper.instance().onScormReady).toHaveBeenCalled();
  });

  test('hides loading screen and navigates to the splash page', () => {
    // setup
    const wrapper = shallow(<LoadingNav {...mockProps} />);
    wrapper.instance().goToSplashScreen = jest.fn();
    wrapper.setProps({ dataReady: true });

    // function under test
    wrapper.update();

    // expectations
    expect(mockProps.updateTimedAchievements).toHaveBeenCalled();
    expect(hideLoader).toHaveBeenCalled();
    expect(wrapper.instance().goToSplashScreen).toHaveBeenCalled();
  });

  test('loading screen remains visible', () => {
    // setup
    const wrapper = shallow(<LoadingNav {...mockProps} />);
    wrapper.instance().findAndGoToScreen = jest.fn();
    wrapper.setProps({ dataReady: false });

    // function under test
    wrapper.update();

    // expectations
    expect(hideLoader).not.toHaveBeenCalled();
    expect(wrapper.instance().findAndGoToScreen).not.toHaveBeenCalled();
  });
});

describe('method onScormReady', () => {
  test('xapi will be initalised', () => {
    // setup
    const scormData = {
      learnerID: 'aa@aa.aa',
      learnerName: 'irrelevant',
      lessonLocation: '/splash'
    };
    const wrapper = shallow(<LoadingNav {...mockProps} {...scormData} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().retrieveDataFromSuspendData = jest.fn();
    global.process.env.PLATFORM = 'production';

    // function under test
    wrapper.instance().onScormReady();

    // expectations
    expect(xapi.initialiseLrs).toHaveBeenCalledWith(
      expect.objectContaining({
        id: scormData.learnerID,
        name: scormData.learnerName
      }),
      true
    );
    expect(wrapper.instance().retrieveDataFromSuspendData).not.toHaveBeenCalled();
    expect(mockProps.suspendDataParsed).toHaveBeenCalledWith(true);
    expect(hideLoader).not.toHaveBeenCalled();
  });

  test('retrieves data from the suspend data', () => {
    // setup
    const scormData = {
      learnerID: 'aa@aa.aa',
      learnerName: 'irrelevant',
      lessonLocation: '/splash',
      suspendData: { foo: 'bar' }
    };
    const wrapper = shallow(<LoadingNav {...mockProps} {...scormData} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().retrieveDataFromSuspendData = jest.fn();
    global.process.env.PLATFORM = 'production';

    // function under test
    wrapper.instance().onScormReady();

    // expectations
    expect(wrapper.instance().retrieveDataFromSuspendData).toHaveBeenCalledWith(
      scormData.suspendData
    );
    expect(mockProps.suspendDataParsed).toHaveBeenCalledWith(true);
    expect(hideLoader).not.toHaveBeenCalled();
  });

  test('xapi cannot be initalised', () => {
    // setup
    const scormData = {
      learnerID: '',
      learnerName: '',
      lessonLocation: '/'
    };
    const wrapper = shallow(<LoadingNav {...mockProps} {...scormData} />);
    wrapper.instance().retrieveDataFromSuspendData = jest.fn();

    // function under test
    wrapper.instance().onScormReady();

    // expectations
    expect(xapi.initialiseLrs).not.toHaveBeenCalled();
    expect(wrapper.instance().retrieveDataFromSuspendData).not.toHaveBeenCalled();
    expect(hideLoader).not.toHaveBeenCalled();
  });
});

describe('method retrieveDataFromSuspendData()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<LoadingNav {...mockProps} />);
  });

  test('empty suspend data', () => {
    wrapper.instance().retrieveDataFromSuspendData({});
    expect(mockProps.setSettings).not.toHaveBeenCalled();
  });

  test('suspend data with settings', () => {
    wrapper.instance().retrieveDataFromSuspendData({
      settings: {
        foo: 'bar'
      }
    });
    expect(mockProps.setSettings).toHaveBeenCalledWith(expect.any(Object));
  });

  describe('suspend data with diagnostic data', () => {
    test('diagnostic not completed', () => {
      wrapper.instance().retrieveDataFromSuspendData({
        diagnostic: false
      });
      expect(mockProps.setDiagnosticData).not.toHaveBeenCalled();
    });

    test('diagnostic completed', () => {
      wrapper.instance().retrieveDataFromSuspendData({
        diagnostic: true
      });
      expect(mockProps.setDiagnosticData).toHaveBeenCalledWith(true);
    });
  });

  describe('suspend data with scores', () => {
    test('scores with categories', () => {
      wrapper.instance().retrieveDataFromSuspendData({
        score: {
          rank: 'irrelevant',
          running: 1,
          total: 2,
          categories: { foo: 1 }
        }
      });
      expect(mockProps.setRank).toHaveBeenCalledWith(expect.any(String));
      expect(mockProps.setScores).toHaveBeenCalledWith(expect.any(Number), expect.any(Number));
      expect(mockProps.setCategories).toHaveBeenCalledWith(expect.any(Object));
    });

    test('scores without categories', () => {
      wrapper.instance().retrieveDataFromSuspendData({
        score: {
          rank: 'irrelevant',
          running: 1,
          total: 2
        }
      });
      expect(mockProps.setRank).toHaveBeenCalledWith(expect.any(String));
      expect(mockProps.setScores).toHaveBeenCalledWith(expect.any(Number), expect.any(Number));
      expect(mockProps.setCategories).not.toHaveBeenCalled();
    });
  });

  test('suspend data with streak', () => {
    wrapper.instance().retrieveDataFromSuspendData({
      streak: {
        active: false,
        completed: true
      }
    });
    expect(mockProps.setStreak).toHaveBeenCalledWith(expect.any(Object));
  });

  test('suspend data with generic data', () => {
    wrapper.instance().retrieveDataFromSuspendData({
      generic: {
        foo: false,
        bar: true
      }
    });
    expect(mockProps.setGenericData).toHaveBeenCalledWith(expect.any(Object));
  });

  test('suspend data with prompt data', () => {
    wrapper.instance().retrieveDataFromSuspendData({
      prompts: {
        foo: false,
        bar: true
      }
    });
    expect(mockProps.addPrompts).toHaveBeenCalledWith(expect.any(Object));
  });

  test('suspend data with achievements data', () => {
    const achievements = {
      completed: ['foo'],
      lastCompleted: 'foo'
    };
    wrapper.instance().retrieveDataFromSuspendData({ achievements });
    expect(mockProps.restoreAchievements).toHaveBeenCalledWith(
      achievements.completed,
      achievements.lastCompleted
    );
  });

  test('suspend data with clientproposal data', () => {
    wrapper.instance().retrieveDataFromSuspendData({
      clientProposalData: {
        foo: false,
        bar: true
      }
    });
    expect(mockProps.setClientProposalData).toHaveBeenCalledWith(expect.any(Object));
  });

  test('suspend data with tutorial data', () => {
    wrapper.instance().retrieveDataFromSuspendData({
      tutorial: {
        launched: true
      }
    });
    expect(mockProps.setTutorialLaunched).toHaveBeenCalledWith(expect.any(Boolean));
  });
});

test('should mapStateToProps', () => {
  const state = {
    genericData: {
      dataReady: false
    },
    scormData: {
      learnerID: '',
      learnerName: '',
      lessonLocation: '',
      suspendData: {}
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    ...state.genericData,
    ...state.scormData
  });
});
