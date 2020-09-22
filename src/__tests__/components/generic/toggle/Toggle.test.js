/* global toJson */
import React from 'react';
import Toggle from '../../../../components/generic/toggle/Toggle';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    checked: false,
    handleChange: jest.fn()
  };
});

test('renders an unchecked Toggle', () => {
  const wrapper = shallow(<Toggle {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders a checked Toggle', () => {
  const wrapper = shallow(<Toggle {...mockProps} checked />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method onChange() - sets the checked state', () => {
  const checked = true;
  const wrapper = shallow(<Toggle {...mockProps} />);
  wrapper.instance().onChange(checked);
  expect(mockProps.handleChange).toHaveBeenCalledWith(checked);
});
