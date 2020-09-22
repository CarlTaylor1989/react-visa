/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import CheckboxLabel from '../../../../components/generic/checkboxlabel/CheckboxLabel';

let mockProps;
beforeEach(() => {
  mockProps = {
    disabled: false,
    elementId: 'irrelevant',
    isSelected: false,
    label: 'irrelevant',
    onCheckboxChange: jest.fn()
  };
});

test('renders the CheckboxLabel component with the enabled state', () => {
  const wrapper = shallow(<CheckboxLabel {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the CheckboxLabel component with the disabled state', () => {
  const wrapper = shallow(<CheckboxLabel {...mockProps} disabled />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('calls the change event on the checkbox', () => {
  const wrapper = shallow(<CheckboxLabel {...mockProps} />);
  wrapper.find('input').at(0).simulate('change');
  expect(mockProps.onCheckboxChange).toHaveBeenCalledWith(mockProps.elementId);
});
