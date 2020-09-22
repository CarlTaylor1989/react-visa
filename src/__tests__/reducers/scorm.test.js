import { SCORM } from 'pipwerks-scorm-api-wrapper';
import * as types from '../../actions/scormTypes';
import scromReducer from '../../reducers/scorm';
import config from '../../tracking/scorm/config.json';
import * as initialState from '../../tracking/scorm/scormInitialState.json';

jest.mock('pipwerks-scorm-api-wrapper');
jest.mock('../../tracking/scorm/config.json');

beforeEach(() => {
  jest.clearAllMocks();
});

test('return the initial state', () => {
  expect(scromReducer.scormData(undefined, {})).toEqual(initialState);
});

describe('INITIALISE_SCORM', () => {
  let initState;
  let state;
  let finalState;
  const learnerName = 'Learner name';
  const learnerID = 'id0';
  const lessonLocation = '/splash';
  const suspendData = '{"foo":"bar"}';

  beforeEach(() => {
    // default state
    initState = {
      ...initialState
    };
  });

  afterEach(() => {
    expect(state).toEqual(finalState);
  });

  test('scorm already initialised', () => {
    // setup
    initState = {
      ...initialState,
      scormInitialised: true,
      learnerID: 'id0',
      learnerName: 'lorem ipsum',
    };
    finalState = {
      ...initialState,
      scormInitialised: true,
      learnerID: 'id0',
      learnerName: 'lorem ipsum',
      suspendData: {}
    };

    // functon under test
    state = scromReducer.scormData(initState, {
      type: types.INITIALISE_SCORM
    });
  });

  test('initialise SCORM 2004', () => {
    // setup
    SCORM.init = jest.fn().mockReturnValue(true);
    SCORM.get = jest.fn((val) => {
      let value;
      if (val === 'cmi.learner_name') {
        value = learnerName;
      } else if (val === 'cmi.learner_id') {
        value = learnerID;
      } else if (val === 'cmi.location') {
        value = lessonLocation;
      } else { // 'cmi.suspend_data'
        value = suspendData;
      }
      return value;
    });
    finalState = {
      ...initialState,
      scormInitialised: true,
      learnerID,
      learnerName,
      lessonLocation,
      suspendData: JSON.parse(suspendData)
    };

    // functon under test
    state = scromReducer.scormData(initState, {
      type: types.INITIALISE_SCORM
    });

    // expectations
    expect(SCORM.version).toBe('2004');
    expect(SCORM.init).toHaveBeenCalled();
    expect(SCORM.get).toHaveBeenCalledTimes(4);
  });

  test('initialisation of SCORM 2004 failed', () => {
    // setup
    SCORM.init = jest.fn().mockReturnValue(false);
    SCORM.get = jest.fn();
    finalState = {
      ...initialState
    };

    // functon under test
    state = scromReducer.scormData(initState, {
      type: types.INITIALISE_SCORM
    });

    // expectations
    expect(SCORM.init).toHaveBeenCalled();
    expect(SCORM.get).not.toHaveBeenCalled();
  });

  test('initialise SCORM 1.2', () => {
    // setup
    config.version = '1.2';
    SCORM.init = jest.fn().mockReturnValue(true);
    SCORM.get = jest.fn((val) => {
      let value;
      if (val === 'cmi.core.student_name') {
        value = learnerName;
      } else if (val === 'cmi.core.student_id') {
        value = learnerID;
      } else if (val === 'cmi.core.lesson_location') {
        value = lessonLocation;
      } else { // 'cmi.suspend_data'
        value = suspendData;
      }
      return value;
    });
    finalState = {
      ...initialState,
      scormInitialised: true,
      learnerID,
      learnerName,
      lessonLocation,
      suspendData: JSON.parse(suspendData)
    };

    // functon under test
    state = scromReducer.scormData(initState, {
      type: types.INITIALISE_SCORM
    });

    // expectations
    expect(SCORM.version).toBe(config.version);
    expect(SCORM.init).toHaveBeenCalled();
    expect(SCORM.get).toHaveBeenCalledTimes(4);
  });

  test('initialise SCORM 1.2 - no suspend data available', () => {
    // setup
    config.version = '1.2';
    SCORM.init = jest.fn().mockReturnValue(true);
    SCORM.get = jest.fn((val) => {
      let value;
      if (val === 'cmi.core.student_name') {
        value = learnerName;
      } else if (val === 'cmi.core.student_id') {
        value = learnerID;
      } else { // 'cmi.suspend_data'
        value = '';
      }
      return value;
    });
    finalState = {
      ...initialState,
      scormInitialised: true,
      learnerID,
      learnerName,
      lessonLocation: '/',
      suspendData: {}
    };

    // functon under test
    state = scromReducer.scormData(initState, {
      type: types.INITIALISE_SCORM
    });

    // expectations
    expect(SCORM.version).toBe(config.version);
    expect(SCORM.init).toHaveBeenCalled();
    expect(SCORM.get).toHaveBeenCalledTimes(4);
  });
});

describe('SET_LESSON_LOCATION', () => {
  test('sets the lesson location and saves it to the LMS', () => {
    // setup
    SCORM.set = jest.fn();
    const lessonLocation = '/splash';
    const initState = {
      ...initialState,
      scormInitialised: true
    };
    const finalState = {
      ...initState,
      lessonLocation
    };

    // function under test
    const state = scromReducer.scormData(initState, {
      type: types.SET_LESSON_LOCATION,
      lessonLocation,
    });

    // expectations
    expect(state).toEqual(finalState);
    expect(SCORM.set).toHaveBeenCalledWith(
      expect.any(String),
      lessonLocation
    );
  });

  test('sets the lesson location only to the redux state', () => {
    // setup
    SCORM.set = jest.fn();
    const lessonLocation = '/splash';
    const finalState = {
      ...initialState,
      lessonLocation
    };

    // function under test
    const state = scromReducer.scormData(initialState, {
      type: types.SET_LESSON_LOCATION,
      lessonLocation,
    });

    // expectations
    expect(state).toEqual(finalState);
    expect(SCORM.set).not.toHaveBeenCalled();
  });
});

test('SET_COMPLETION_STATUS', () => {
  // setup
  const completionStatus = 'completed';
  const finalState = {
    ...initialState,
    completionStatus
  };

  // function under test
  const state = scromReducer.scormData(initialState, {
    type: types.SET_COMPLETION_STATUS,
    completionStatus,
  });

  // expectations
  expect(state).toEqual(finalState);
});

test('SET_SUSPEND_DATA_ITEM', () => {
  // setup
  const finalState = {
    ...initialState,
    suspendData: { foo: 'bar' }
  };

  // function under test
  const state = scromReducer.scormData(initialState, {
    type: types.SET_SUSPEND_DATA_ITEM,
    item: 'foo',
    value: 'bar'
  });

  // expectations
  expect(state).toEqual(finalState);
});

test('SET_SCORM_VALUE', () => {
  // setup
  const finalState = {
    ...initialState,
    foo: 'bar'
  };

  // function under test
  const state = scromReducer.scormData(initialState, {
    type: types.SET_SCORM_VALUE,
    item: 'foo',
    value: 'bar'
  });

  // expectations
  expect(state).toEqual(finalState);
});

describe('COMMIT', () => {
  let initState;
  let state;
  let finalState;

  beforeEach(() => {
    SCORM.set = jest.fn();
    SCORM.status = jest.fn();
    SCORM.save = jest.fn();

    initState = {
      ...initState
    };
  });

  test('SCORM not initialised', () => {
    // setup
    finalState = {
      ...initState
    };

    // function under test
    state = scromReducer.scormData(initState, {
      type: types.COMMIT
    });

    // expectations
    expect(SCORM.set).not.toHaveBeenCalled();
    expect(SCORM.status).not.toHaveBeenCalled();
    expect(SCORM.save).not.toHaveBeenCalled();
  });

  test('SCORM initialised', () => {
    // setup
    initState.scormInitialised = true;
    initState.completionStatus = 'completed';

    finalState = {
      ...initState
    };

    // function under test
    state = scromReducer.scormData(initState, {
      type: types.COMMIT
    });

    // expectations
    expect(SCORM.set).toHaveBeenCalledWith('cmi.suspend_data', '{}');
    expect(SCORM.status).toHaveBeenCalledWith('set', initState.completionStatus);
    expect(SCORM.save).toHaveBeenCalled();
  });

  afterEach(() => {
    expect(state).toEqual(finalState);
  });
});

describe('TERMINATE_SCORM', () => {
  let initState;
  let state;
  let finalState;

  beforeEach(() => {
    SCORM.set = jest.fn();
    SCORM.status = jest.fn();
    SCORM.save = jest.fn();
    SCORM.quit = jest.fn();
    initState = {
      ...initState
    };
  });

  test('SCORM not initialised', () => {
    // setup
    finalState = {
      ...initState
    };

    // function under test
    state = scromReducer.scormData(initState, {
      type: types.TERMINATE_SCORM
    });

    // expectations
    expect(SCORM.quit).not.toHaveBeenCalled();
  });

  test('SCORM initialised and lms terminate was successful', () => {
    // setup
    SCORM.quit.mockReturnValue(true);
    initState.scormInitialised = true;
    initState.completionStatus = 'completed';

    finalState = {
      ...initState,
      scormInitialised: false
    };

    // function under test
    state = scromReducer.scormData(initState, {
      type: types.TERMINATE_SCORM
    });

    // expectations
    expect(SCORM.quit).toHaveBeenCalled();
    expect(SCORM.set).toHaveBeenCalledWith('cmi.suspend_data', '{}');
    expect(SCORM.status).toHaveBeenCalledWith('set', initState.completionStatus);
    expect(SCORM.save).toHaveBeenCalled();
  });

  test('SCORM initialised and lms terminate was unsuccessful', () => {
    // setup
    SCORM.quit.mockReturnValue(false);
    initState.scormInitialised = true;
    initState.completionStatus = 'completed';

    finalState = {
      ...initState
    };

    // function under test
    state = scromReducer.scormData(initState, {
      type: types.TERMINATE_SCORM
    });

    // expectations
    expect(SCORM.quit).toHaveBeenCalled();
  });

  afterEach(() => {
    expect(state).toEqual(finalState);
  });
});
