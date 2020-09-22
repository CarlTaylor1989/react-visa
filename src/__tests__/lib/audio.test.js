import * as audio from '../../lib/audio';

test('method getAudioPlayer()', () => {
  const output = audio.getAudioPlayer();
  expect(output).toBeNull();
});

test('method getAppRoot()', () => {
  const output = audio.getAppRoot();
  expect(output).toEqual('');
});
