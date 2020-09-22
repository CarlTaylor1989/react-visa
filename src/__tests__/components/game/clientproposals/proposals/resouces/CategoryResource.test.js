/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import CategoryResource from
  '../../../../../../components/game/clientproposals/proposals/resources/CategoryResource';
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

test('renders the CategoryResource component', () => {
  const wrapper = shallow(<CategoryResource {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
  expect(wrapper.instance().timeAvailable).toBeDefined();
});

test('method componentWillUnmount()', () => {
  const wrapper = shallow(<CategoryResource {...mockProps} />);
  wrapper.instance().sendStatement = jest.fn();
  wrapper.instance().componentWillUnmount();
  expect(wrapper.instance().sendStatement).toHaveBeenCalled();
});

test('method sendStatement()', () => {
  const wrapper = shallow(<CategoryResource {...mockProps} />);
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
