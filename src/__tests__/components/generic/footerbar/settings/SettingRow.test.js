/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import SettingRow from '../../../../../components/generic/footerbar/settings/SettingRow';
import { sendInteractionData } from '../../../../../tracking/xapi/XApiAdapter';

jest.mock('../../../../../tracking/xapi/XApiAdapter');

let mockProps;

beforeEach(() => {
  mockProps = {
    name: 'tutorial',
    checked: false,
    handleChange: jest.fn(),
    hasToggle: false,
    buttonLabel: '',
    handleClick: jest.fn(),
    hasButton: false
  };
});

test('renders a settings row with a toggle', () => {
  const wrapper = shallow(<SettingRow {...mockProps} hasToggle />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders a settings row with a button', () => {
  const wrapper = shallow(<SettingRow {...mockProps} hasButton />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method onToggleChange', () => {
  // setup
  const wrapper = shallow(<SettingRow {...mockProps} />);

  // functions under test
  wrapper.instance().onToggleChange(false);
  wrapper.instance().onToggleChange(true);

  // expectations
  expect(mockProps.handleChange).toHaveBeenCalledTimes(2);
  expect(mockProps.handleChange).toHaveBeenCalledWith(expect.any(Boolean));
  expect(sendInteractionData).toHaveBeenCalledTimes(2);
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'interacted',
    activity: expect.objectContaining({
      id: expect.stringContaining('settings'),
      type: 'interaction',
      title: expect.any(String),
      description: expect.any(String)
    }),
    response: expect.objectContaining({
      detail: expect.any(String)
    }),
    parent: ''
  }));
});

test('method onButtonClick', () => {
  // setup
  const wrapper = shallow(<SettingRow {...mockProps} />);

  // functions under test
  wrapper.instance().onButtonClick();

  // expectations
  expect(mockProps.handleClick).toHaveBeenCalled();
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'interacted',
    activity: expect.objectContaining({
      id: expect.stringContaining('settings'),
      type: 'interaction',
      title: expect.any(String),
      description: expect.any(String)
    }),
    parent: ''
  }));
});
