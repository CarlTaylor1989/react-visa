import * as types from './settingsTypes';

export function toggleAudio(audio) {
  return {
    type: types.TOGGLE_AUDIO_STATE,
    audio
  };
}

export function toggleTooltips(tooltips) {
  return {
    type: types.TOGGLE_TOOLTIPS_STATE,
    tooltips
  };
}

export function setSettings(settings) {
  return {
    type: types.SET_SETTINGS,
    settings
  };
}
