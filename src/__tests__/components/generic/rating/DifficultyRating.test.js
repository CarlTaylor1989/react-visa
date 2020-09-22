/* global toJson */
import React from 'react';
import DifficultyRating from '../../../../components/generic/rating/DifficultyRating';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    currentRating: 1,
    numberOfStars: 10
  };
});

test('renders the DifficultyRating component', () => {
  const wrapper = shallow(<DifficultyRating {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
