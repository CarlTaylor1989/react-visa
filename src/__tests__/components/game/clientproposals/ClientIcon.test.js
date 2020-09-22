/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ClientIcon from '../../../../components/game/clientproposals/ClientIcon';

let mockProps;
beforeEach(() => {
  mockProps = {
    client: 'irrelevant'
  };
});

test('renders the ClientIcon component', () => {
  const wrapper = shallow(<ClientIcon {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
