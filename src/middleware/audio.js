import * as actions from '../actions/audio';
import * as types from '../actions/audioTypes';
import audioFiles from '../config/audio';
import { getAudioPlayer, getAppRoot } from '../lib/audio';

export const setAudio = () => next => (action) => {
  const updatedAction = action;
  if (action.type === types.SET_AUDIO || action.type === types.SET_PLAY_AUDIO) {
    const player = getAudioPlayer();
    if (player) {
      player.src = `${getAppRoot()}media/${audioFiles[action.audioId]}`;
      player.load();
    }
  }

  next(updatedAction);
};

export const setPlayAudio = ({ dispatch }) => next => (action) => {
  next(action);

  if (action.type === types.SET_PLAY_AUDIO) {
    dispatch(actions.playAudio());
  }
};

export const playAudio = ({ getState }) => next => (action) => {
  next(action);

  if (action.type === types.PLAY_AUDIO) {
    const state = getState();
    const audioId = state.audioData.audioId;
    const audioEnabled = state.settingsData.audio;
    const player = getAudioPlayer();
    if (audioEnabled && audioId && player) {
      player.play();
    }
  }
};

export const pauseAudio = ({ getState }) => next => (action) => {
  next(action);

  if (action.type === types.PAUSE_AUDIO) {
    const audioId = getState().audioData.audioId;
    const player = getAudioPlayer();
    if (audioId && player) {
      player.pause();
    }
  }
};

export const stopAudio = ({ getState }) => next => (action) => {
  next(action);

  if (action.type === types.STOP_AUDIO) {
    const audioId = getState().audioData.audioId;
    const player = getAudioPlayer();
    if (audioId && player) {
      player.pause();
      player.currentTime = 0;
    }
  }
};

export default [
  setAudio,
  setPlayAudio,
  playAudio,
  pauseAudio,
  stopAudio
];
