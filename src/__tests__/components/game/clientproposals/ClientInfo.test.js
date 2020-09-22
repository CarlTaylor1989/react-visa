/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ClientInfo from '../../../../components/game/clientproposals/ClientInfo';

let mockProps;
beforeEach(() => {
  mockProps = {
    client: 'irrelevant',
    status: 0,
    attempts: 0
  };
});

test('renders the ClientInfo component', () => {
  const wrapper = shallow(<ClientInfo {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
