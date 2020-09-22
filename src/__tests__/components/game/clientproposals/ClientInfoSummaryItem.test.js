/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ClientInfoSummaryItem from
  '../../../../components/game/clientproposals/ClientInfoSummaryItem';

let mockProps;
beforeEach(() => {
  mockProps = {
    fieldName: 'account',
    client: 'client1'
  };
});

test('renders the ClientInfoSummaryItem component', () => {
  const wrapper = shallow(<ClientInfoSummaryItem {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ClientInfoSummaryItem component with the difficulty type', () => {
  const wrapper = shallow(<ClientInfoSummaryItem {...mockProps} type="difficulty" />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
