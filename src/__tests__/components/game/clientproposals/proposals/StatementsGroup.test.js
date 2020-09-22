/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import StatementsGroup from
  '../../../../../components/game/clientproposals/proposals/StatementsGroup';

let mockProps;
beforeEach(() => {
  mockProps = {
    client: 'client1',
    group: 'goals'
  };
});

test('renders the StatementsGroup component', () => {
  const wrapper = shallow(<StatementsGroup {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
