/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import AnimatedText from '../../../../components/generic/animatedtext/AnimatedText';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    texts: [
      {
        id: 'one',
        text: 'MESSAGE 1 MOTIVATIONAL MESSAGE'
      },
      {
        id: 'two',
        text: 'MESSAGE 2 MOTIVATIONAL MESSAGE'
      },
      {
        id: 'three',
        text: 'MESSAGE 3 MOTIVATIONAL MESSAGE'
      },
      {
        id: 'four',
        text: 'MESSAGE 4 MOTIVATIONAL MESSAGE'
      }

    ],
    playAnimation: false,
    handleAnimationEnded: jest.fn()
  };
});

test('renders the AnimatedText component', () => {
  const wrapper = shallow(<AnimatedText {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('doesnt have "play" class by default', () => {
  const wrapper = shallow(<AnimatedText {...mockProps} />);
  expect(wrapper.hasClass('play')).toEqual(false);
});


test('has "play" class if "playAnimation" is true', () => {
  const wrapper = shallow(<AnimatedText {...mockProps} playAnimation />);
  expect(wrapper.hasClass('play')).toEqual(true);
});

test('handleAnimationEnded is not called if animationEnd has not been triggered', () => {
  shallow(<AnimatedText {...mockProps} />);
  expect(mockProps.handleAnimationEnded).not.toHaveBeenCalled();
});

test('calls handleAnimationEnded when animation has finished', () => {
  const wrapper = shallow(<AnimatedText {...mockProps} />);
  wrapper.find('.text').last().simulate('animationEnd');

  expect(mockProps.handleAnimationEnded).toHaveBeenCalled();
  expect(mockProps.handleAnimationEnded).toHaveBeenCalledTimes(1);
});
