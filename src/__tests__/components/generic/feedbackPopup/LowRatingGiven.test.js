/* global toJson */
import React from 'react';
import LowRatingGiven from '../../../../components/generic/feedbackPopup/LowRatingGiven';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    lowRatingFeedback: 'Lorem ipsum',
    handleChange: jest.fn(),
    submitLowRatingFeedback: jest.fn(),
    closePopup: jest.fn()
  };
});

test('renders the LowRatingGiven component', () => {
  const wrapper = shallow(<LowRatingGiven {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
