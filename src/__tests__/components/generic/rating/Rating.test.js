/* global toJson */
import React from 'react';
import Rating from '../../../../components/generic/rating/Rating';
import StarButton from '../../../../components/generic/rating/StarButton';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    numberOfStars: 5,
    currentRating: 0,
    setCurrentRating: jest.fn()
  };
});

test('renders the Rating component', () => {
  const wrapper = shallow(<Rating {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the correct number of stars', () => {
  // setup
  const wrapper = shallow(<Rating {...mockProps} numberOfStars={10} />);

  // expectations
  expect(wrapper.find('.rating').exists()).toBe(true);
  expect(wrapper.find(StarButton).exists()).toBe(true);
  expect(wrapper.find(StarButton)).toHaveLength(10);
});

test('setCurrentRating called with correct value when a star is clicked', () => {
  // setup
  const wrapper = mount(<Rating {...mockProps} />);
  wrapper.find(StarButton).at(2).simulate('click', {
    target: {
      dataset: {
        value: 3
      }
    }
  });

  // expectations
  expect(mockProps.setCurrentRating).toHaveBeenCalled();
  expect(mockProps.setCurrentRating).toHaveBeenCalledTimes(1);
  expect(mockProps.setCurrentRating).toHaveBeenCalledWith(3);
});

test('is-hovered class is not applied to any stars by default', () => {
  const wrapper = mount(<Rating {...mockProps} />);
  expect(wrapper.find('.is-hovered')).toHaveLength(0);
});

test('is-hovered class is applied to relevant stars when a star is hovered', () => {
  // setup
  const wrapper = mount(<Rating {...mockProps} />);
  wrapper.find(StarButton).at(3).simulate('mouseover', {
    target: {
      dataset: {
        value: 3
      }
    }
  });

  // expectations
  expect(wrapper.find('.is-hovered')).toHaveLength(3);
});

test('removes hovered state from the hovered star', () => {
  // setup
  const wrapper = mount(<Rating {...mockProps} />);
  wrapper.find('.wrapper').at(0).simulate('mouseleave');

  // expectations
  expect(wrapper.find('.is-hovered')).toHaveLength(0);
});

test('calls the focus callback when a star is focused', () => {
  // setup
  const wrapper = mount(<Rating {...mockProps} />);
  wrapper.find(StarButton).at(3).simulate('focus', {
    target: {
      dataset: {
        value: 3
      }
    }
  });

  // expectations
  expect(wrapper.find('.is-hovered')).toHaveLength(0);
});
