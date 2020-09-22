import * as actions from '../../actions/audio';
import * as types from '../../actions/audioTypes';

test('method setAudio()', () => {
  const audioId = 'irrelevant';
  const output = actions.setAudio(audioId);
  expect(output).toEqual({
    type: types.SET_AUDIO,
    audioId
  });
});

test('method setPlayAudio()', () => {
  const audioId = 'irrelevant';
  const output = actions.setPlayAudio(audioId);
  expect(output).toEqual({
    type: types.SET_PLAY_AUDIO,
    audioId
  });
});

test('method playAudio()', () => {
  const output = actions.playAudio();
  expect(output).toEqual({
    type: types.PLAY_AUDIO
  });
});

test('method pauseAudio()', () => {
  const output = actions.pauseAudio();
  expect(output).toEqual({
    type: types.PAUSE_AUDIO
  });
});

test('method stopAudio()', () => {
  const output = actions.stopAudio();
  expect(output).toEqual({
    type: types.STOP_AUDIO
  });
});
