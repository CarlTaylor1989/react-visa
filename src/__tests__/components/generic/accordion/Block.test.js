/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import Block from '../../../../components/generic/accordion/Block';

let mockProps;
beforeEach(() => {
  mockProps = {
    isOpen: true,
    title: 'some title',
    onToggle: jest.fn(),
    children: <div>Test</div>,
    hasProduct: true
  };
});

test('renders the Block component', () => {
  const wrapper = shallow(<Block {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the Block component in closed state', () => {
  mockProps.isOpen = false;
  const wrapper = shallow(<Block {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the Block component without product', () => {
  mockProps.hasProduct = false;
  const wrapper = shallow(<Block {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the Block component with selected indicator', () => {
  mockProps.selected = ['p1', 'p2'];
  const wrapper = shallow(<Block {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('calls onToggle when toggleButton clicked', () => {
  const wrapper = shallow(<Block {...mockProps} />);
  wrapper.find('.toggleButton').simulate('click');
  expect(mockProps.onToggle).toHaveBeenCalled();
});
