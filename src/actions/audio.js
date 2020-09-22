import * as types from './audioTypes';

export const setAudio = audioId => ({
  type: types.SET_AUDIO,
  audioId
});

export const setPlayAudio = audioId => ({
  type: types.SET_PLAY_AUDIO,
  audioId
});

export const playAudio = () => ({
  type: types.PLAY_AUDIO
});

export const pauseAudio = () => ({
  type: types.PAUSE_AUDIO
});

export const stopAudio = () => ({
  type: types.STOP_AUDIO
});
