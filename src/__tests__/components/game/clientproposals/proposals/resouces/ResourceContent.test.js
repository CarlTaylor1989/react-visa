/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ResourceContent from
  '../../../../../../components/game/clientproposals/proposals/resources/ResourceContent';

let mockProps;
beforeEach(() => {
  mockProps = {
    client: 'client1',
    resource: {},
    resourceIndex: 'res1',
    type: '',
  };
});

test('renders the ResourceContent component without any content', () => {
  const wrapper = shallow(<ResourceContent {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ResourceContent component with the call resource', () => {
  const wrapper = shallow(<ResourceContent {...mockProps} type="call" />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ResourceContent component with the email resource', () => {
  const wrapper = shallow(<ResourceContent {...mockProps} type="email" />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ResourceContent component with the report resource', () => {
  const wrapper = shallow(<ResourceContent {...mockProps} type="report" />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ResourceContent component with the quote resource', () => {
  const wrapper = shallow(<ResourceContent {...mockProps} type="quote" />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
