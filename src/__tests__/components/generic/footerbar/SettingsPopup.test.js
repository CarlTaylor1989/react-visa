/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  SettingsPopup,
  mapStateToProps,
  mapDispatchToProps
} from '../../../../components/generic/footerbar/SettingsPopup';
import * as hintActions from '../../../../actions/hints';
import * as settingsActions from '../../../../actions/settings';
import * as hintTypes from '../../../../actions/hintsTypes';
import * as settingsTypes from '../../../../actions/settingsTypes';
import { sendInteractionData } from '../../../../tracking/xapi/XApiAdapter';

jest.mock('../../../../tracking/xapi/XApiAdapter');

let mockProps;

beforeEach(() => {
  mockProps = {
    audio: false,
    changeRegion: jest.fn(),
    closePopup: jest.fn(),
    exitPopup: jest.fn(),
    popupReferrer: 'irrelevant',
    region: '',
    resetDiagnostic: jest.fn(),
    setHintsPaused: jest.fn(),
    showPopup: false,
    toggleAudio: jest.fn(),
    toggleTooltips: jest.fn(),
    tooltips: false
  };
});

test('renders a closed popup', () => {
  const wrapper = shallow(<SettingsPopup {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders an open popup', () => {
  const wrapper = shallow(<SettingsPopup {...mockProps} showPopup />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders an open popup with a selected region', () => {
  const wrapper = shallow(<SettingsPopup {...mockProps} region="ac" />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidUpdate()', () => {
  test('popup about to show - pause hints', () => {
    const wrapper = shallow(<SettingsPopup {...mockProps} />);
    wrapper.setProps({ showPopup: true });
    wrapper.update();
    expect(mockProps.setHintsPaused).toHaveBeenCalledWith(true);
  });

  test('popup is still displayed', () => {
    const wrapper = shallow(<SettingsPopup {...mockProps} showPopup />);
    wrapper.setProps({ showPopup: true });
    wrapper.update();
    expect(mockProps.setHintsPaused).not.toHaveBeenCalled();
  });
});

test('method onPopupExit()', () => {
  // setup
  const wrapper = shallow(<SettingsPopup {...mockProps} />);
  wrapper.instance().sendPopupTrackingData = jest.fn();

  // function under test
  wrapper.instance().onPopupExit();

  // expectations
  expect(mockProps.exitPopup).toHaveBeenCalled();
  expect(mockProps.setHintsPaused).toHaveBeenCalledWith(false);
});

test('method onRegionChange()', () => {
  // setup
  const wrapper = shallow(<SettingsPopup {...mockProps} />);
  wrapper.instance().sendPopupTrackingData = jest.fn();

  // function under test
  wrapper.instance().onRegionChange();

  // expectations
  expect(mockProps.changeRegion).toHaveBeenCalled();
  expect(wrapper.instance().sendPopupTrackingData).toHaveBeenCalled();
});

test('method sendPopupTrackingData', () => {
  const wrapper = shallow(<SettingsPopup {...mockProps} />);
  wrapper.instance().sendPopupTrackingData();
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'experienced',
    activity: expect.objectContaining({
      id: 'settings',
      type: 'slide',
      title: expect.any(String),
      description: expect.any(String)
    }),
    response: expect.objectContaining({
      timeAvailable: null,
      timeResponse: expect.any(Date)
    }),
    parent: '',
    referrer: expect.any(String)
  }));
});

test('should mapStateToProps', () => {
  const state = {
    diagnosticData: {
      region: 'eu'
    },
    genericData: {
      popupReferrer: 'irrelevant'
    },
    settingsData: {
      tooltips: true,
      audio: true
    }
  };
  const expected = {
    ...state.settingsData,
    ...state.diagnosticData,
    ...state.genericData
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    ...expected
  });
});

test('calls toggleTooltips', () => {
  const dispatch = jest.fn();
  jest.spyOn(settingsActions, 'toggleTooltips').mockReturnValue('toggleTooltips()');
  const props = mapDispatchToProps(dispatch);
  props.toggleTooltips();
  expect(dispatch).toHaveBeenCalledWith({
    type: settingsTypes.TOGGLE_TOOLTIPS_STATE
  });
});

test('calls toggleAudio', () => {
  const dispatch = jest.fn();
  jest.spyOn(settingsActions, 'toggleAudio').mockReturnValue('toggleAudio()');
  const props = mapDispatchToProps(dispatch);
  props.toggleAudio();
  expect(dispatch).toHaveBeenCalledWith({
    type: settingsTypes.TOGGLE_AUDIO_STATE
  });
});

test('calls setHintsPaused', () => {
  // setup
  const dispatch = jest.fn();
  jest.spyOn(
    hintActions,
    'setHintsPaused'
  ).mockReturnValue('setHintsPaused()');
  const props = mapDispatchToProps(dispatch);

  // function under test
  props.setHintsPaused();

  // expectations
  expect(dispatch).toHaveBeenCalledWith({
    type: hintTypes.SET_HINTS_PAUSED
  });
});
