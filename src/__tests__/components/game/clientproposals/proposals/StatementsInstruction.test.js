/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import StatementsInstruction from
  '../../../../../components/game/clientproposals/proposals/StatementsInstruction';

let mockProps;
beforeEach(() => {
  mockProps = {
    client: 'client1',
    completed: false
  };
});

test('renders the StatementsInstruction component with the default instruction', () => {
  const wrapper = shallow(<StatementsInstruction {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the StatementsInstruction component with the completed instruction', () => {
  const wrapper = shallow(<StatementsInstruction {...mockProps} completed />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
