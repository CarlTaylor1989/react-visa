import {
  setAudio,
  setPlayAudio,
  playAudio,
  pauseAudio,
  stopAudio
} from '../../middleware/audio';
import * as types from '../../actions/audioTypes';
import { getAudioPlayer, getAppRoot } from '../../lib/audio';

jest.mock('../../lib/audio');

const next = jest.fn();
let store;
let action;

beforeEach(() => {
  jest.resetAllMocks();
  store = {
    dispatch: jest.fn(),
    getState: jest.fn()
  };
  getAppRoot.mockImplementation(() => '');
});

describe('method setAudio()', () => {
  let player;
  beforeEach(() => {
    action = {
      type: types.SET_AUDIO,
      audioId: 'au1'
    };
    const router = {
      location: {
        pathname: '/game/network/map'
      }
    };
    store.getState.mockReturnValue({ router });
    player = { load: jest.fn() };
  });

  test('ignores the current action', () => {
    setAudio(store)(next)({ type: 'foo' });
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Object));
  });

  test('sets the audio src on the SET_AUDIO action', () => {
    getAudioPlayer.mockImplementation(() => player);
    setAudio(store)(next)(action);
    expect(player.load).toHaveBeenCalled();
    expect(player.src).toEqual(expect.any(String));
  });

  test('player does not exist', () => {
    action.type = types.SET_PLAY_AUDIO;
    getAudioPlayer.mockImplementation(() => null);
    setAudio(store)(next)(action);
    expect(player.load).not.toHaveBeenCalled();
  });

  test('player does not exist and location is empty', () => {
    // setup
    const router = {
      location: {
        pathname: ''
      }
    };
    store.getState.mockReturnValue({ router });
    action.type = types.SET_PLAY_AUDIO;
    getAudioPlayer.mockImplementation(() => null);

    // function under test
    setAudio(store)(next)(action);

    // expectation
    expect(player.load).not.toHaveBeenCalled();
  });
});

describe('method setPlayAudio()', () => {
  beforeEach(() => {
    action = {
      type: types.SET_PLAY_AUDIO,
    };
  });

  test('ignores the current action', () => {
    setPlayAudio(store)(next)({ type: 'foo' });
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Object));
  });

  test('calls the play action', () => {
    setPlayAudio(store)(next)(action);
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Object));
    expect(next).toHaveBeenCalledWith(expect.any(Object));
  });
});

describe('method playAudio()', () => {
  let player;
  beforeEach(() => {
    action = {
      type: types.PLAY_AUDIO,
    };
    const audioData = {
      audioId: 'au1'
    };
    const settingsData = {
      audio: true
    };
    store.getState.mockReturnValue({
      audioData,
      settingsData
    });
    player = { play: jest.fn() };
  });

  test('ignores the current action', () => {
    playAudio(store)(next)({ type: 'foo' });
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Object));
  });

  test('plays the audio file', () => {
    getAudioPlayer.mockImplementation(() => player);
    playAudio(store)(next)(action);
    expect(player.play).toHaveBeenCalled();
  });

  test('player does not exist', () => {
    getAudioPlayer.mockImplementation(() => null);
    playAudio(store)(next)(action);
    expect(player.play).not.toHaveBeenCalled();
  });
});

describe('method pauseAudio()', () => {
  let player;
  beforeEach(() => {
    action = {
      type: types.PAUSE_AUDIO,
    };
    const audioData = {
      audioId: 'au1'
    };
    store.getState.mockReturnValue({ audioData });
    player = { pause: jest.fn() };
  });

  test('ignores the current action', () => {
    pauseAudio(store)(next)({ type: 'foo' });
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Object));
  });

  test('pauses the audio player', () => {
    getAudioPlayer.mockImplementation(() => player);
    pauseAudio(store)(next)(action);
    expect(player.pause).toHaveBeenCalled();
  });

  test('player does not exist', () => {
    getAudioPlayer.mockImplementation(() => null);
    pauseAudio(store)(next)(action);
    expect(player.pause).not.toHaveBeenCalled();
  });
});

describe('method stopAudio()', () => {
  let player;
  beforeEach(() => {
    action = {
      type: types.STOP_AUDIO,
    };
    const audioData = {
      audioId: 'au1'
    };
    store.getState.mockReturnValue({ audioData });
    player = { pause: jest.fn() };
  });

  test('ignores the current action', () => {
    stopAudio(store)(next)({ type: 'foo' });
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Object));
  });

  test('stops the audio player', () => {
    getAudioPlayer.mockReturnValue(player);
    stopAudio(store)(next)(action);
    expect(player.pause).toHaveBeenCalled();
    expect(player.currentTime).toEqual(0);
  });

  test('player does not exist', () => {
    getAudioPlayer.mockImplementation(() => null);
    stopAudio(store)(next)(action);
    expect(player.pause).not.toHaveBeenCalled();
  });
});
