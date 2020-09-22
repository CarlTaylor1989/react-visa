/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  App,
  mapDispatchToProps
} from '../../components/App';
import {
  hideLoader,
  closeWindow,
  getScreenSize
} from '../../lib/app';
import * as actions from '../../actions/scorm';
import * as types from '../../actions/scormTypes';
import * as xapi from '../../tracking/xapi/XApiAdapter';

jest.useFakeTimers();

jest.mock('../../lib/app');
jest.mock('../../tracking/xapi/XApiAdapter');

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  console.warn = jest.fn(); // eslint-disable-line no-console
  mockProps = {
    initialiseScorm: jest.fn(),
    prepareSuspendData: jest.fn(),
    setPlayAudio: jest.fn(),
    terminateScorm: jest.fn(),
  };
});

test('renders the App component', () => {
  const wrapper = shallow(<App {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('mounts the App component in production mode', () => {
  // setup
  global.process.env.PLATFORM = 'local';
  const wrapper = shallow(<App {...mockProps} />, {
    disableLifecycleMethods: true
  });

  // function under test
  wrapper.instance().componentDidMount();

  // expectation
  expect(hideLoader).toHaveBeenCalled();
});

test('method onCloseExitPopup()', () => {
  const wrapper = shallow(<App {...mockProps} />);
  wrapper.instance().onCloseExitPopup();
  expect(wrapper.instance().state.displayExitPopup).toBeFalsy();
});

test('method onDisplayExitPopup()', () => {
  const wrapper = shallow(<App {...mockProps} />);
  wrapper.instance().onDisplayExitPopup();
  expect(wrapper.instance().state.displayExitPopup).toBeTruthy();
});

test('method onExitGame()', () => {
  // setup
  const wrapper = shallow(<App {...mockProps} />);
  wrapper.instance().closeScormAPIConnection = jest.fn();

  // function under test
  wrapper.instance().onExitGame();

  // expectations
  expect(wrapper.instance().closeScormAPIConnection).toHaveBeenCalled();
  jest.runAllTimers();

  expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), expect.any(Number));
  const callback = setTimeout.mock.calls[0][0];
  callback();

  expect(closeWindow).toHaveBeenCalled();
});

test('method onHoverBtn()', () => {
  const wrapper = shallow(<App {...mockProps} />);
  wrapper.instance().onHoverBtn();
  expect(mockProps.setPlayAudio).toHaveBeenCalledWith(expect.any(String));
});

describe('method updateWindowSize()', () => {
  test('available height less than desinged height', () => {
    // setup
    getScreenSize.mockImplementation(() => ({
      height: 500
    }));
    const wrapper = shallow(<App {...mockProps} />);

    // function under test
    wrapper.instance().updateWindowSize();

    // expectation
    expect(wrapper.instance().state.deviceScale).toEqual(expect.any(Number));
  });

  test('available width less than desinged width', () => {
    // setup
    getScreenSize.mockImplementation(() => ({
      width: 1500
    }));
    const wrapper = shallow(<App {...mockProps} />);

    // function under test
    wrapper.instance().updateWindowSize();

    // expectation
    expect(wrapper.instance().state.deviceScale).toEqual(expect.any(Number));
  });

  test('available width and height greater than the designed size', () => {
    // setup
    getScreenSize.mockImplementation(() => ({
      height: 1000,
      width: 2000
    }));
    const wrapper = shallow(<App {...mockProps} />);

    // function under test
    wrapper.instance().updateWindowSize();

    // expectation
    expect(wrapper.instance().state.deviceScale).toEqual(1);
  });
});

test('App component will unmount', () => {
  const wrapper = shallow(<App {...mockProps} />);
  wrapper.unmount();
  expect(xapi.exitLrs).toHaveBeenCalled();
  expect(mockProps.terminateScorm).toHaveBeenCalled();
});

test('metehod closeScormAPIConnection()', () => {
  const wrapper = shallow(<App {...mockProps} />);
  wrapper.instance().closeScormAPIConnection();
  expect(mockProps.terminateScorm).toHaveBeenCalled();
});

test('should mapDispatchToProps', () => {
  const dispatch = jest.fn();
  jest.spyOn(actions, 'initialiseScorm').mockReturnValue('initialiseScorm()');
  const props = mapDispatchToProps(dispatch);
  props.initialiseScorm();
  expect(dispatch).toHaveBeenCalledWith({
    type: types.INITIALISE_SCORM
  });
});
