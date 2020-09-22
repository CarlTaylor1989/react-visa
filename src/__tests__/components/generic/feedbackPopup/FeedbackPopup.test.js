/* global toJson */
import React from 'react';
import FeedbackPopup from '../../../../components/generic/feedbackPopup/FeedbackPopup';
import StarButton from '../../../../components/generic/rating/StarButton';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    closePopup: jest.fn(),
    showPopup: true,
  };
});

test('renders the FeedbackPopup component', () => {
  const wrapper = shallow(<FeedbackPopup {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the GiveRating by default', () => {
  const wrapper = shallow(<FeedbackPopup {...mockProps} />);
  expect(wrapper.find('GiveRating')).toHaveLength(1);
});

test('LowRating is not rendered by default', () => {
  const wrapper = shallow(<FeedbackPopup {...mockProps} />);
  expect(wrapper.find('LowRatingGiven')).toHaveLength(0);
});

test('LowRating is rendered when a rating of three or less stars is submitted', () => {
  // setup
  const wrapper = mount(<FeedbackPopup {...mockProps} />);
  wrapper.find(StarButton).first().simulate('click');
  wrapper.find('.submitBtn').simulate('click');

  // expectation
  expect(wrapper.find('LowRatingGiven')).toHaveLength(1);
});

test('FeedbackPopup is closed when reason for low rating is submitted', () => {
  // setup
  const wrapper = mount(<FeedbackPopup {...mockProps} />);
  wrapper.find(StarButton).first().simulate('click');
  wrapper.find('.submitBtn').simulate('click');
  wrapper.find('textarea').simulate('change', { target: { value: 'Lorem ipsum' } });
  wrapper.find('.submitBtn').simulate('click');

  // expectations
  expect(mockProps.closePopup).toHaveBeenCalled();
  expect(mockProps.closePopup).toHaveBeenCalledTimes(1);
});

test('SuccessfulSubmit is rendered when rating above three stars is submitted', () => {
  // setup
  const wrapper = mount(<FeedbackPopup {...mockProps} />);
  wrapper.find(StarButton).at(4).simulate('click');
  wrapper.find('.submitBtn').simulate('click');

  // expectations
  expect(wrapper.find('LowRatingGiven')).toHaveLength(0);
  expect(wrapper.find('SuccessfulSubmit')).toHaveLength(1);
});
