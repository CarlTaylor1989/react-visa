/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  GoToScreen,
  mapStateToProps,
  mapDispatchToProps
} from '../../../components/generic/GoToScreen';
import * as actions from '../../../actions/scorm';
import * as types from '../../../actions/scormTypes';
import { getNextScreen, findNextScreen } from '../../../lib/navigation';

jest.mock('../../../lib/navigation');

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    commit: jest.fn(),
    diagnosticCompleted: false,
    diagnosticVisited: false,
    introSeqCompleted: false,
    lessonLocation: '',
    prepareSuspendData: jest.fn(),
    push: jest.fn(),
    resetDiagnostic: jest.fn(),
    setLessonLocation: jest.fn(),
    setPlayAudio: jest.fn()
  };
});

test('renders the Splash component with a start button', () => {
  const wrapper = shallow(<GoToScreen {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method onChangeRegion()', () => {
  // setup
  const wrapper = shallow(<GoToScreen {...mockProps} />);
  wrapper.instance().onGoToScreen = jest.fn();

  // function under test
  wrapper.instance().onChangeRegion();

  // expectations
  expect(mockProps.resetDiagnostic).toHaveBeenCalled();
  expect(wrapper.instance().onGoToScreen).toHaveBeenCalledWith(expect.any(String));
});

describe('method onGoToScreen()', () => {
  test('sets the specified screen to the lesson location and navigates to that screen', () => {
    const newScreenId = 'welcome';
    const wrapper = shallow(<GoToScreen {...mockProps} />);
    wrapper.instance().onGoToScreen(newScreenId);
    expect(mockProps.setLessonLocation).toHaveBeenCalledWith(newScreenId);
  });

  test('invalid screen id passed', () => {
    const wrapper = shallow(<GoToScreen {...mockProps} />);
    wrapper.instance().onGoToScreen();
    expect(mockProps.setLessonLocation).not.toHaveBeenCalledWith();
  });
});

test('method onHoverBtn()', () => {
  const wrapper = shallow(<GoToScreen {...mockProps} />);
  wrapper.instance().onHoverBtn();
  expect(mockProps.setPlayAudio).toHaveBeenCalledWith(expect.any(String));
});

test('method goToNextScreen()', () => {
  mockProps.lessonLocation = 'irrelevant';
  const wrapper = shallow(<GoToScreen {...mockProps} />);
  wrapper.instance().goToScreenAfter = jest.fn();
  wrapper.instance().goToNextScreen();
  expect(wrapper.instance().goToScreenAfter).toHaveBeenCalledWith(mockProps.lessonLocation);
});

test('method goToScreenAfter()', () => {
  // setup
  const screenId = 'foo';
  const nextScreen = 'bar';
  getNextScreen.mockReturnValue(nextScreen);
  const wrapper = shallow(<GoToScreen {...mockProps} />);
  wrapper.instance().onGoToScreen = jest.fn();

  // function under test
  wrapper.instance().goToScreenAfter(screenId);

  // expectations
  expect(getNextScreen).toHaveBeenCalledWith(screenId);
  expect(wrapper.instance().onGoToScreen).toHaveBeenCalledWith(nextScreen);
});

test('method findAndGoToScreen()', () => {
  // setup
  const nextScreen = 'irrelevant';
  findNextScreen.mockReturnValue(nextScreen);
  const wrapper = shallow(<GoToScreen {...mockProps} />);
  wrapper.instance().onGoToScreen = jest.fn();

  // function under test
  wrapper.instance().findAndGoToScreen();

  // expectations
  expect(findNextScreen).toHaveBeenCalledWith(
    expect.any(Boolean),
    expect.any(Boolean),
    expect.any(Boolean),
    expect.any(String)
  );
  expect(wrapper.instance().onGoToScreen).toHaveBeenCalledWith(nextScreen);
});

test('method goToSplashScreen()', () => {
  // setup
  const wrapper = shallow(<GoToScreen {...mockProps} />);
  wrapper.instance().onGoToScreen = jest.fn();

  // function under test
  wrapper.instance().goToSplashScreen();

  // expectation
  expect(wrapper.instance().onGoToScreen).toHaveBeenCalledWith(expect.any(String));
});

test('should mapStateToProps', () => {
  const state = {
    diagnosticData: {
      completed: false
    },
    scormData: {
      lessonLocation: ''
    },
    genericData: {
      screen: ''
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    ...state.scormData,
    ...state.genericData,
    diagnosticCompleted: state.diagnosticData.completed
  });
});

test('should mapDispatchToProps', () => {
  const dispatch = jest.fn();
  jest.spyOn(actions, 'setLessonLocation').mockReturnValue('setLessonLocation()');
  const props = mapDispatchToProps(dispatch);
  props.setLessonLocation();
  expect(dispatch).toHaveBeenCalledWith({
    type: types.SET_LESSON_LOCATION
  });
});
