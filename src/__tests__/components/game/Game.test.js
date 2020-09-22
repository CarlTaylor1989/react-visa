/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  Game,
  mapStateToProps
} from '../../../components/game/Game';
import { getLocationTutorialSlideIndex } from '../../../lib/tutorial';
import { FEEDBACK_TRIGGER } from '../../../config/constants';

jest.mock('../../../lib/tutorial');

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    commit: jest.fn(),
    diagnosticCompleted: true,
    disableFeedback: jest.fn(),
    feedbackTriggered: false,
    feedbackDisabled: false,
    feedbackDays: 0,
    lessonLocation: '',
    location: {
      pathname: '/irrelevant'
    },
    prepareSuspendData: jest.fn(),
    push: jest.fn(),
    setLessonLocation: jest.fn(),
    setPlayAudio: jest.fn(),
    setScreenReferrer: jest.fn(),
    setTutorialSlideIndex: jest.fn(),
    setGenericData: jest.fn(),

  };
});

test('renders the Game component', () => {
  const wrapper = shallow(<Game {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the Game component with the feedback popup', () => {
  const wrapper = shallow(<Game
    {...mockProps}
    feedbackTriggered
    feedbackDays={FEEDBACK_TRIGGER}
  />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method componentDidMount()', () => {
  // setup
  const wrapper = shallow(<Game {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().onDisplayFeedbackPopup = jest.fn();
  wrapper.instance().state.displayFeedbackPopup = true;

  // function under test
  wrapper.instance().componentDidMount();

  // expectation
  expect(mockProps.disableFeedback).toHaveBeenCalled();
  expect(wrapper.instance().onDisplayFeedbackPopup).toHaveBeenCalled();
});

test('method isNetworkBtnActive()', () => {
  // setup
  const wrapper = shallow(<Game {...mockProps} />);
  wrapper.instance().checkForChildPaths = jest.fn().mockReturnValue(true);

  // function under test
  const output = wrapper.instance().isNetworkBtnActive();

  // expectation
  expect(output).toBeTruthy();
});

test('method isClientBtnActive()', () => {
  // setup
  const wrapper = shallow(<Game {...mockProps} />);
  wrapper.instance().checkForChildPaths = jest.fn().mockReturnValue(true);

  // function under test
  const output = wrapper.instance().isClientBtnActive();

  // expectation
  expect(output).toBeTruthy();
});

test('method checkForChildPaths()', () => {
  // setup
  const pathname = 'irrelevant';
  mockProps.location = { pathname };
  const wrapper = shallow(<Game {...mockProps} />);

  // function under test
  const output = wrapper.instance().checkForChildPaths(pathname);

  // expectation
  expect(output).toBeTruthy();
});

test('method onCloseHelpPopup()', () => {
  const wrapper = shallow(<Game {...mockProps} />);
  wrapper.instance().onCloseHelpPopup();
  expect(wrapper.instance().state.displayHelpPopup).toBeFalsy();
});

test('method onCloseFeedbackPopup()', () => {
  const wrapper = shallow(<Game {...mockProps} />);
  wrapper.instance().onCloseFeedbackPopup();
  expect(wrapper.instance().state.displayFeedbackPopup).toBeFalsy();
});

test('method onDisplayHelpPopup()', () => {
  // setup
  getLocationTutorialSlideIndex.mockImplementation(() => 3);
  const wrapper = shallow(<Game {...mockProps} />);

  // function under test
  wrapper.instance().onDisplayHelpPopup();

  // expectations
  expect(mockProps.setTutorialSlideIndex).toHaveBeenCalledWith(expect.any(Number));
  expect(wrapper.instance().state.displayHelpPopup).toBeTruthy();
});

test('method onDisplayFeedbackPopup()', () => {
  const wrapper = shallow(<Game {...mockProps} />);
  wrapper.instance().onDisplayFeedbackPopup();
  expect(wrapper.instance().state.displayFeedbackPopup).toBeTruthy();
});

test('should mapStateToProps', () => {
  const state = {
    genericData: {
      feedback: {
        triggered: false
      }
    },
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    feedbackTriggered: state.genericData.feedback.triggered,
    feedbackDays: state.genericData.feedback.days
  });
});
