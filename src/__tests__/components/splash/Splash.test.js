/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import { I18n } from 'react-redux-i18n';
import history from '../../../__mocks__/routerHistoryMock';
import { Splash, mapStateToProps } from '../../../components/splash/Splash';

I18n.t = jest.fn(() => ({
  0: {
    id: 'one',
    text: 'MESSAGE ONE MOTIVATIONAL MESSAGE'
  },
  1: {
    id: 'two',
    text: 'MESSAGE TWO MOTIVATIONAL MESSAGE'
  },
  2: {
    id: 'three',
    text: 'MESSAGE THREE MOTIVATIONAL MESSAGE'
  },
  3: {
    id: 'four',
    text: 'MESSAGE FOUR MOTIVATIONAL MESSAGE'
  }
}));

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    history,
    diagnosticCompleted: false,
    diagnosticVisited: false,
    lessonLocation: '',
    setLessonLocation: jest.fn(),
    setPopupReferrer: jest.fn(),
    setScreenReferrer: jest.fn(),
    suspendData: {}
  };
});

test('renders the Splash component with a start button', () => {
  const wrapper = shallow(<Splash {...mockProps} />);
  wrapper.instance().goToNextScreen = jest.fn();
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method componentWillUnmount', () => {
  const wrapper = shallow(<Splash {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().componentWillUnmount();
  expect(mockProps.setScreenReferrer).toHaveBeenCalledWith(expect.any(String));
});

test('renders the Splash component with a continue button', () => {
  mockProps.lessonLocation = '/diagnostic';
  mockProps.diagnosticVisited = true;
  const wrapper = shallow(<Splash {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('next button should have class "hide" until animation is complete', () => {
  const wrapper = shallow(<Splash {...mockProps} />);

  expect(wrapper.find('.nextBtn').hasClass('hide')).toBe(true);

  wrapper.instance().setState({ isIntroAnimationComplete: true, playIntroAnimation: true });

  expect(wrapper.find('.nextBtn').hasClass('hide')).toBe(false);
});

test('should mapStateToProps', () => {
  const state = {
    scormData: {
      suspendData: { foo: 'bar' }
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    ...state.scormData
  });
});
