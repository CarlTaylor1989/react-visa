/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  ClientLocked,
  mapDispatchToProps
} from '../../../../components/game/clientproposals/ClientLocked';
import { getRemainingLockedDuration } from '../../../../lib/clients';
import * as actions from '../../../../actions/client';
import * as types from '../../../../actions/clientTypes';

jest.mock('../../../../lib/clients');

let mockProps;
beforeEach(() => {
  mockProps = {
    attempts: 3,
    client: 'irrelevant',
    locked: {
      id: 'irrelevant',
      start: new Date().getTime(),
      duration: 60
    },
    setClientStatus: jest.fn(),
    unlockClient: jest.fn()
  };

  getRemainingLockedDuration.mockImplementation(() => 50);
});

test('renders the ClientLocked component with more than 1 minute left', () => {
  const wrapper = shallow(<ClientLocked {...mockProps} />);
  wrapper.instance().setState({ minutes: 3 });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ClientLocked component with less than a minute left', () => {
  mockProps.locked.duration = 180;
  const wrapper = shallow(<ClientLocked {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method componentWillUnmount()', () => {
  const wrapper = shallow(<ClientLocked {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().componentWillUnmount();
  expect(wrapper.instance().timer).toBeNull();
});

test('method setValues()', () => {
  const wrapper = shallow(<ClientLocked {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().setValues();
  expect(wrapper.instance().state).toMatchObject({
    percentage: expect.any(Number),
    minutes: expect.any(Number),
  });
});

describe('method timerCallback()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ClientLocked {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setValues = jest.fn();
  });

  test('unlocks the current client', () => {
    wrapper.instance().timerCallback();
    expect(mockProps.setClientStatus).toHaveBeenCalled();
  });

  test('client remains locked', () => {
    wrapper.instance().maxTicks = 1000;
    wrapper.instance().timerCallback();
    expect(mockProps.setClientStatus).not.toHaveBeenCalled();
  });
});

test('should mapDispatchToProps', () => {
  const status = 'irrelevant';
  const dispatch = jest.fn();
  jest.spyOn(actions, 'setClientStatus').mockReturnValue('setClientStatus()');
  const props = mapDispatchToProps(dispatch);
  props.setClientStatus(mockProps.client, status);
  expect(dispatch).toHaveBeenCalledWith({
    type: types.SET_CLIENT_STATUS,
    client: mockProps.client,
    status
  });
});
