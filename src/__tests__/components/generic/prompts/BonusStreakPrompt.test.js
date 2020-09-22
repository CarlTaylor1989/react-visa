/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import BonusStreakPrompt from '../../../../components/generic/prompts/BonusStreakPrompt';

let mockProps;
beforeEach(() => {
  mockProps = {
    setPlayAudio: jest.fn()
  };
});

test('renders the BonusStreakPrompt', () => {
  const wrapper = shallow(<BonusStreakPrompt {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
