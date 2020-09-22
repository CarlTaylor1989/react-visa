/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ProductButton from
  '../../../../../components/game/clientproposals/proposals/ProductButton';

let mockProps;
beforeEach(() => {
  mockProps = {
    client: 'client1',
    id: '0',
    isSelected: false,
    productId: 'prod1',
    onProductChange: jest.fn(),
    onLearnMore: jest.fn()
  };
});

test('renders the ProductButton component with the selected state', () => {
  const wrapper = shallow(<ProductButton {...mockProps} isSelected />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ProductButton component with the unselected state', () => {
  const wrapper = shallow(<ProductButton {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ProductButton component with the selected disabled state', () => {
  const wrapper = shallow(
    <ProductButton
      {...mockProps}
      isSelected
      disabled
    />
  );
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ProductButton component with the unselected disabled state', () => {
  const wrapper = shallow(<ProductButton {...mockProps} disabled />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('button calls onProductChange() method when selected', () => {
  const wrapper = shallow(<ProductButton {...mockProps} />);
  wrapper.find('.productButtonWrap').at(0).simulate('click');
  expect(mockProps.onProductChange).toHaveBeenCalled();
});

test('learn more calls onLearnMore() method when selected', () => {
  const wrapper = shallow(<ProductButton {...mockProps} />);
  wrapper.find('.productLearnCta').at(0).simulate('click');
  expect(mockProps.onLearnMore).toHaveBeenCalled();
});
