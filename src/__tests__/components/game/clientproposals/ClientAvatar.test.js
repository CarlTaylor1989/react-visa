/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ClientAvatar from '../../../../components/game/clientproposals/ClientAvatar';

let mockProps;
beforeEach(() => {
  mockProps = {
    client: 'irrelevant'
  };
});

test('renders the ClientAvatar component', () => {
  const wrapper = shallow(<ClientAvatar {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
