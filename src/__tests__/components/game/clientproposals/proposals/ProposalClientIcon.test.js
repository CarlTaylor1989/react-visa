/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ProposalClientIcon from
  '../../../../../components/game/clientproposals/proposals/ProposalClientIcon';

let mockProps;
beforeEach(() => {
  mockProps = {
    client: 'client1',
  };
});

test('renders the ProposalClientIcon component', () => {
  const wrapper = shallow(<ProposalClientIcon {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
