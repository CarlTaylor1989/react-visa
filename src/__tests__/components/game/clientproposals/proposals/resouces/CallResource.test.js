/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import CallResource from
  '../../../../../../components/game/clientproposals/proposals/resources/CallResource';
import { getUnloadEventName } from '../../../../../../lib/app';
import { sendResourceStatement } from '../../../../../../lib/clients';

jest.mock('../../../../../../lib/app');
jest.mock('../../../../../../lib/clients');

let mockProps;
beforeEach(() => {
  mockProps = {
    client: 'client1',
    resourceIndex: 'res2',
  };
  getUnloadEventName.mockImplementation(() => 'irrelevant');
});

test('renders the CallResource component', () => {
  const wrapper = shallow(<CallResource {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
  expect(wrapper.instance().timeAvailable).toBeDefined();
});

test('method componentWillUnmount()', () => {
  const wrapper = shallow(<CallResource {...mockProps} />);
  wrapper.instance().sendStatement = jest.fn();
  wrapper.instance().componentWillUnmount();
  expect(wrapper.instance().sendStatement).toHaveBeenCalled();
});

test('method sendStatement()', () => {
  const wrapper = shallow(<CallResource {...mockProps} />);
  wrapper.instance().sendStatement();
  expect(sendResourceStatement).toHaveBeenCalledWith(
    expect.any(String),
    expect.any(String),
    expect.any(String),
    expect.any(String),
    expect.any(Date),
    expect.any(Number)
  );
});
