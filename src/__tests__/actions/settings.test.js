import * as actions from '../../actions/settings';
import * as types from '../../actions/settingsTypes';

test('method toggleAudio()', () => {
  const audio = false;
  const output = actions.toggleAudio(audio);
  expect(output).toEqual({
    type: types.TOGGLE_AUDIO_STATE,
    audio
  });
});

test('method toggleTooltips()', () => {
  const tooltips = false;
  const output = actions.toggleTooltips(tooltips);
  expect(output).toEqual({
    type: types.TOGGLE_TOOLTIPS_STATE,
    tooltips
  });
});

test('method setSettings()', () => {
  const settings = {
    audio: false,
    tooltips: false
  };
  const output = actions.setSettings(settings);
  expect(output).toEqual({
    type: types.SET_SETTINGS,
    settings
  });
});
