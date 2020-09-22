/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ResourceButton from
  '../../../../../components/game/clientproposals/proposals/ResourceButton';

let mockProps;
beforeEach(() => {
  mockProps = {
    client: 'client1',
    id: '0',
    handleClick: jest.fn()
  };
});

test('renders the ResourceButton component', () => {
  const wrapper = shallow(<ResourceButton {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('handleClick is called', () => {
  const wrapper = shallow(<ResourceButton {...mockProps} />);

  wrapper.simulate('click');
  expect(mockProps.handleClick).toHaveBeenCalled();
});
