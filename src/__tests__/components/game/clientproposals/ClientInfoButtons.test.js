/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  ClientInfoButtons,
  mapDispatchToProps
} from '../../../../components/game/clientproposals/ClientInfoButtons';
import * as actions from '../../../../actions/client';
import * as types from '../../../../actions/clientTypes';
import {
  CLIENT_NOT_STARTED,
  CLIENT_IN_PROGRESS,
  CLIENT_COMPLETED,
  CLIENT_GIVENUP
} from '../../../../config/constants';

let mockProps;
beforeEach(() => {
  mockProps = {
    client: 'irrelevant',
    setClientShowing: jest.fn(),
    setClientStatus: jest.fn(),
    status: CLIENT_NOT_STARTED
  };
});

test('renders the ClientInfoButtons component', () => {
  const wrapper = shallow(<ClientInfoButtons {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ClientInfoButtons component with the start button', () => {
  mockProps.status = CLIENT_NOT_STARTED;
  const wrapper = shallow(<ClientInfoButtons {...mockProps} />);
  expect(wrapper.find('.startClient').exists()).toBe(true);
  expect(wrapper.find('.resumeClient').exists()).toBe(false);
  expect(wrapper.find('.reviewClient').exists()).toBe(false);
});

test('renders the ClientInfoButtons component with the resume button', () => {
  mockProps.status = CLIENT_IN_PROGRESS;
  const wrapper = shallow(<ClientInfoButtons {...mockProps} />);
  expect(wrapper.find('.startClient').exists()).toBe(false);
  expect(wrapper.find('.resumeClient').exists()).toBe(true);
  expect(wrapper.find('.reviewClient').exists()).toBe(false);
});

test('renders the ClientInfoButtons component with the review button', () => {
  mockProps.status = CLIENT_COMPLETED;
  const wrapper = shallow(<ClientInfoButtons {...mockProps} />);
  expect(wrapper.find('.startClient').exists()).toBe(false);
  expect(wrapper.find('.resumeClient').exists()).toBe(false);
  expect(wrapper.find('.reviewClient').exists()).toBe(true);
});

test('renders the ClientInfoButtons component with the review button when given up', () => {
  mockProps.status = CLIENT_GIVENUP;
  const wrapper = shallow(<ClientInfoButtons {...mockProps} />);
  expect(wrapper.find('.startClient').exists()).toBe(false);
  expect(wrapper.find('.resumeClient').exists()).toBe(false);
  expect(wrapper.find('.reviewClient').exists()).toBe(true);
});

test('method onStartClient()', () => {
  // setup
  const wrapper = shallow(<ClientInfoButtons {...mockProps} />);
  wrapper.instance().onResumeClient = jest.fn();

  // function under test
  wrapper.instance().onStartClient();

  // expectations
  expect(mockProps.setClientStatus).toHaveBeenCalledWith(mockProps.client, CLIENT_IN_PROGRESS);
  expect(wrapper.instance().onResumeClient).toHaveBeenCalledWith();
});

test('method onResumeClient()', () => {
  const wrapper = shallow(<ClientInfoButtons {...mockProps} />);
  wrapper.instance().onResumeClient();
  expect(mockProps.setClientShowing).toHaveBeenCalledWith(expect.any(String));
});

test('should mapDispatchToProps', () => {
  const client = 'irrelevant';
  const status = CLIENT_NOT_STARTED;
  const dispatch = jest.fn();
  jest.spyOn(actions, 'setClientStatus').mockReturnValue('setClientStatus()');
  const props = mapDispatchToProps(dispatch);
  props.setClientStatus(client, status);
  expect(dispatch).toHaveBeenCalledWith({
    type: types.SET_CLIENT_STATUS,
    client,
    status
  });
});
