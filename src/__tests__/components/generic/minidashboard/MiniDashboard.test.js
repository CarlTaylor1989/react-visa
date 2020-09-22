/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  MiniDashboard
} from '../../../../components/generic/minidashboard/MiniDashboard';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    achievementsCompletedInSession: false,
    rankIncreaseSession: false,
    setPlayAudio: jest.fn()
  };
});

test('renders the MiniDashboard component', () => {
  const wrapper = shallow(<MiniDashboard {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method onCloseDashboard()', () => {
  const wrapper = shallow(<MiniDashboard {...mockProps} />);
  wrapper.instance().onCloseDashboard();
  expect(wrapper.instance().state.displayDashboard).toEqual(false);
});

test('method onDisplayDashboard()', () => {
  const wrapper = shallow(<MiniDashboard {...mockProps} />);
  wrapper.instance().onDisplayDashboard();
  expect(wrapper.instance().state.displayDashboard).toEqual(true);
});

test('method onHoverBtn()', () => {
  const wrapper = shallow(<MiniDashboard {...mockProps} />);
  wrapper.instance().onHoverBtn();
  expect(mockProps.setPlayAudio).toHaveBeenCalledWith(expect.any(String));
});
