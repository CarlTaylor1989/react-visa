/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import MultipleAchievementsPrompt from '../../../../components/generic/prompts/MultipleAchievementsPrompt'; // eslint-disable-line max-len
import AchievementPrompt from '../../../../components/generic/prompts/AchievementPrompt';
import {
  ACHIEVEMENT_PROMPT,
} from '../../../../config/constants';

let mockProps;
beforeEach(() => {
  mockProps = {
    prompts: [{
      id: 'ac1',
      type: ACHIEVEMENT_PROMPT
    },
    {
      id: 'ac21',
      type: ACHIEVEMENT_PROMPT
    }],
    setPlayAudio: jest.fn()
  };
});

test('renders an open popup with multiple achievements content', () => {
  const wrapper = shallow(<MultipleAchievementsPrompt {...mockProps} showPopup />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
  expect(wrapper.find('.multipleAchievementsTitle').exists()).toBe(true);
  expect(wrapper.find('.multipleAchievements').exists()).toBe(true);
  expect(wrapper.find(AchievementPrompt)).toHaveLength(mockProps.prompts.length);
});
