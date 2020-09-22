/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ResetStreakPopup from '../../../../components/generic/iframepopup/ResetStreakPopup';

let mockProps;

beforeEach(() => {
  mockProps = {
    displayResetStreak: false,
    onCloseResetStreakPopup: jest.fn(),
    client: 'client1'
  };
});

test('renders the ResetStreakPopup component', () => {
  const wrapper = shallow(<ResetStreakPopup {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method onClose()', () => {
  const wrapper = shallow(<ResetStreakPopup {...mockProps} />);
  wrapper.instance().onClose();
  expect(mockProps.onCloseResetStreakPopup).toHaveBeenCalled();
});

test('method onYes()', () => {
  const wrapper = shallow(<ResetStreakPopup {...mockProps} />);
  wrapper.instance().onYes();
  expect(mockProps.onCloseResetStreakPopup).toHaveBeenCalled();
});
