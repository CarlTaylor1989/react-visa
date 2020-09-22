/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ClientIconButton from '../../../../components/game/clientproposals/ClientIconButton';

let mockProps;
beforeEach(() => {
  mockProps = {
    client: 'lv1cl1',
    completed: false,
    disabled: false,
    locked: {},
    reqAttempts: 1,
    selected: false,
    onClientSelected: jest.fn()
  };
});

test('renders the ClientIconButton component with the selected state', () => {
  const wrapper = shallow(<ClientIconButton {...mockProps} selected />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ClientIconButton component with the disabled state', () => {
  const wrapper = shallow(<ClientIconButton {...mockProps} disabled />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ClientIconButton component with the completed state', () => {
  const wrapper = shallow(<ClientIconButton {...mockProps} completed />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ClientIconButton component with the locked state', () => {
  const wrapper = shallow(<ClientIconButton {...mockProps} locked={{ id: 'irrelevant' }} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('button calls onClientSelected() method when selected', () => {
  const wrapper = shallow(<ClientIconButton {...mockProps} />);
  wrapper.find('.clientIconButton').at(0).simulate('click');
  expect(mockProps.onClientSelected).toHaveBeenCalled();
});
