/* global toJson */
import React from 'react';
import GiveRating from '../../../../components/generic/feedbackPopup/GiveRating';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    currentRating: 0,
    setCurrentRating: jest.fn(),
    submitRating: jest.fn(),
    closePopup: jest.fn()
  };
});

test('renders the GiveRating component', () => {
  const wrapper = shallow(<GiveRating {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('submit button is disabled initially', () => {
  const wrapper = shallow(<GiveRating {...mockProps} />);
  expect(wrapper.find('.submitBtn').hasClass('disabled')).toEqual(true);
});

test('submit button is enabled once currentRating is not zero', () => {
  const wrapper = shallow(<GiveRating {...mockProps} currentRating={4} />);
  expect(wrapper.find('.submitBtn').hasClass('disabled')).toEqual(false);
});

test('rating should be submitted when submit button is clicked', () => {
  // setup
  const wrapper = shallow(<GiveRating {...mockProps} currentRating={3} />);
  wrapper.find('.submitBtn').simulate('click');

  // expectations
  expect(mockProps.submitRating).toHaveBeenCalled();
  expect(mockProps.submitRating).toHaveBeenCalledTimes(1);
});
