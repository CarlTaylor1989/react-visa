/* global toJson */
import React from 'react';
import StarButton from '../../../../components/generic/rating/StarButton';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();

  mockProps = {
    active: false,
    handleClick: jest.fn(),
    handleFocus: jest.fn(),
    handleHover: jest.fn(),
    hovered: false,
    index: 0
  };
});

test('renders the StarButton component', () => {
  const wrapper = shallow(<StarButton {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('has the correct data-id attribute', () => {
  const wrapper = shallow(<StarButton {...mockProps} index={6} />);
  expect(wrapper.prop('data-value')).toBe(7);
});

test('has is-active class when active prop is true', () => {
  const wrapper = shallow(<StarButton {...mockProps} active />);
  expect(wrapper.hasClass('is-active')).toBe(true);
});

test('has is-hovered class when hovered prop is true', () => {
  const wrapper = shallow(<StarButton {...mockProps} hovered />);
  expect(wrapper.hasClass('is-hovered')).toBe(true);
});

test('handleHover is called when a star button is hovered', () => {
  // setup
  const wrapper = shallow(<StarButton {...mockProps} />);
  const mockEvent = {
    target: {
      dataset: {
        value: 3
      }
    }
  };

  wrapper.simulate('mouseover', mockEvent);

  // expectations
  expect(mockProps.handleHover).toHaveBeenCalled();
  expect(mockProps.handleHover).toHaveBeenCalledTimes(1);
  expect(mockProps.handleHover).toHaveBeenCalledWith(mockEvent);
});

test('handleClick is called when a star button is clicked', () => {
  // setup
  const wrapper = shallow(<StarButton {...mockProps} />);
  const mockEvent = {
    target: {
      dataset: {
        value: 3
      }
    }
  };

  wrapper.simulate('click', mockEvent);

  // expectations
  expect(mockProps.handleClick).toHaveBeenCalled();
  expect(mockProps.handleClick).toHaveBeenCalledTimes(1);
  expect(mockProps.handleClick).toHaveBeenCalledWith(mockEvent);
});

test('handleFocus is called when a star button is focussed', () => {
  // setup
  const wrapper = shallow(<StarButton {...mockProps} />);

  wrapper.prop('onFocus')();

  // expectations
  expect(mockProps.handleFocus).toHaveBeenCalled();
  expect(mockProps.handleFocus).toHaveBeenCalledTimes(1);
});
