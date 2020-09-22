/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import MultipleAchievementsPrompt from '../../../../components/generic/prompts/MultipleAchievementsPrompt'; // eslint-disable-line max-len
import PromptsPopup from '../../../../components/generic/prompts/PromptsPopup';
import {
  ACHIEVEMENT_PROMPT,
  PRODUCT_PROMPT,
  RANK_PROMPT,
  BONUS_STREAK_PROMPT
} from '../../../../config/constants';

jest.useFakeTimers();

let mockProps;
beforeEach(() => {
  mockProps = {
    closePopup: jest.fn(),
    exitPopup: jest.fn(),
    index: 0,
    prompts: [],
    setPlayAudio: jest.fn(),
    showPopup: false
  };
});

test('renders a closed popup', () => {
  const wrapper = shallow(<PromptsPopup {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders an open popup with the achievement content', () => {
  mockProps.prompts = [{
    id: 'ac1',
    type: ACHIEVEMENT_PROMPT
  }];
  const wrapper = shallow(<PromptsPopup {...mockProps} showPopup />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders MultipleAchievementsPrompt when there are multiple achievements', () => {
  mockProps.prompts = [{
    id: 'ac1',
    type: ACHIEVEMENT_PROMPT
  },
  {
    id: 'ac21',
    type: ACHIEVEMENT_PROMPT
  }];
  const wrapper = shallow(<PromptsPopup {...mockProps} showPopup />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
  expect(wrapper.find(MultipleAchievementsPrompt).exists()).toBe(true);
  expect(wrapper.find(MultipleAchievementsPrompt)).toHaveLength(1);
});

test('renders an open popup with the product content', () => {
  mockProps.prompts = [{
    id: 'p4',
    family: 'm1f2',
    map: 'm1',
    type: PRODUCT_PROMPT
  }];
  const wrapper = shallow(<PromptsPopup {...mockProps} showPopup />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders an open popup with the rank content', () => {
  mockProps.prompts = [{
    id: 'r1',
    type: RANK_PROMPT
  }];
  const wrapper = shallow(<PromptsPopup {...mockProps} showPopup />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders an open popup with the bonus streak content', () => {
  mockProps.prompts = [{
    type: BONUS_STREAK_PROMPT
  }];
  const wrapper = shallow(<PromptsPopup {...mockProps} showPopup />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders an open popup without prompt content', () => {
  mockProps.prompts = [{
    id: 'foo',
    type: 'bar'
  }];
  const wrapper = shallow(<PromptsPopup {...mockProps} showPopup />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method closePopup()', () => {
  const wrapper = shallow(<PromptsPopup {...mockProps} />);
  wrapper.instance().closePopup();
  expect(mockProps.closePopup).toHaveBeenCalled();
});
