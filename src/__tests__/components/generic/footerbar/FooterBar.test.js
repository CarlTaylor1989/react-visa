/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  FooterBar,
  mapStateToProps,
  mapDispatchToProps
} from '../../../../components/generic/footerbar/FooterBar';
import * as actions from '../../../../actions/achievements';
import * as types from '../../../../actions/achievementTypes';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    changeRegion: jest.fn(),
    settingsBtnEnabled: true,
    setPlayAudio: jest.fn(),
    updateSettingsAchievements: jest.fn()
  };
});

test('renders the FooterBar component with an enabled settings button', () => {
  const wrapper = shallow(<FooterBar {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the FooterBar component with a disabled settings button', () => {
  mockProps.settingsBtnEnabled = false;
  const wrapper = shallow(<FooterBar {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method onCloseSettings()', () => {
  const wrapper = shallow(<FooterBar {...mockProps} />);
  wrapper.instance().onCloseSettings();
  expect(wrapper.instance().state.displaySettings).toBeFalsy();
});

test('method onDisplaySettings()', () => {
  const wrapper = shallow(<FooterBar {...mockProps} />);
  wrapper.instance().onDisplaySettings();
  expect(wrapper.instance().state.displaySettings).toBeTruthy();
});

test('method onChangeRegion()', () => {
  // setup
  const wrapper = shallow(<FooterBar {...mockProps} />);
  wrapper.instance().onCloseSettings = jest.fn();

  // function under test
  wrapper.instance().onChangeRegion();

  // expectations
  expect(wrapper.instance().onCloseSettings).toHaveBeenCalled();
  expect(mockProps.changeRegion).toHaveBeenCalled();
});

test('method onHoverBtn()', () => {
  const wrapper = shallow(<FooterBar {...mockProps} />);
  wrapper.instance().onHoverBtn();
  expect(mockProps.setPlayAudio).toHaveBeenCalledWith(expect.any(String));
});

test('should mapStateToProps', () => {
  const state = {
    genericData: {
      settingsBtnEnabled: true
    }
  };
  const expected = {
    ...state.genericData
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    ...expected
  });
});

test('should mapDispatchToProps', () => {
  const dispatch = jest.fn();
  jest.spyOn(actions, 'updateSettingsAchievements').mockReturnValue('updateSettingsAchievements()');
  const props = mapDispatchToProps(dispatch);
  props.updateSettingsAchievements();
  expect(dispatch).toHaveBeenCalledWith({
    type: types.UPDATE_SETTINGS_ACHIEVEMENTS
  });
});
