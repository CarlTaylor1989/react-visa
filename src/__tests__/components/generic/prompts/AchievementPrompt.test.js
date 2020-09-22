/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import AchievementPrompt from '../../../../components/generic/prompts/AchievementPrompt';

let mockProps;
beforeEach(() => {
  mockProps = {
    achievementId: 'ac1',
    setPlayAudio: jest.fn()
  };
});

test('renders the AchievementPrompt with a score of 0', () => {
  const wrapper = shallow(<AchievementPrompt {...mockProps} achievementId="foo" />, {
    disableLifecycleMethods: true
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the AchievementPrompt with an achievement score', () => {
  const wrapper = shallow(<AchievementPrompt {...mockProps} />, {
    disableLifecycleMethods: true
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders a different layout when multipleAchievements prop has been passed', () => {
  const wrapper = shallow(<AchievementPrompt {...mockProps} multipleAchievements />, {
    disableLifecycleMethods: true
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
  expect(wrapper.find('.popupTitle').exists()).toBe(false);
  expect(wrapper.find('.achievementText').exists()).toBe(true);
});

describe('method componentDidUpdate()', () => {
  test('achievement changed', () => {
    // setup
    const wrapper = shallow(<AchievementPrompt {...mockProps} />);
    wrapper.instance().playAudio = jest.fn();
    wrapper.setProps({ achievementId: 'ac2' });

    // function under test
    wrapper.update();

    // expectation
    expect(wrapper.instance().playAudio).toHaveBeenCalled();
  });

  test('achievement remains the same', () => {
    // setup
    const wrapper = shallow(<AchievementPrompt {...mockProps} />);
    wrapper.instance().playAudio = jest.fn();
    wrapper.setProps({ achievementId: '' });

    // function under test
    wrapper.update();

    // expectation
    expect(wrapper.instance().playAudio).not.toHaveBeenCalled();
  });
});

test('method playAudio()', () => {
  const wrapper = shallow(<AchievementPrompt {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().playAudio();
  expect(mockProps.setPlayAudio).toHaveBeenCalledWith(expect.any(String));
});
