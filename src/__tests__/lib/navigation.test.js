import _ from 'lodash';
import * as navigation from '../../config/navigation';
import * as lib from '../../lib/navigation';

describe('method getNextScreen()', () => {
  test('returns the current screen', () => {
    const url = _.last(navigation.sequence).url;
    const output = lib.getNextScreen(url);
    expect(output).toEqual(url);
  });

  test('returns the next screen in sequence', () => {
    // setup
    const inputUrl = _.first(navigation.sequence).url;
    const expectedUrl = _.nth(navigation.sequence, 1).url;

    // function under test
    const output = lib.getNextScreen(inputUrl);

    // expectation
    expect(output).toEqual(expectedUrl);
  });
});

describe('method findNextScreen()', () => {
  test('returns the splash page', () => {
    const output = lib.findNextScreen(false, false, false, navigation.splashPath);
    expect(output).toEqual(navigation.splashPath);
  });

  test('returns the diagnostic page', () => {
    const output = lib.findNextScreen(false, true, false, navigation.splashPath);
    expect(output).toEqual(navigation.diagnosticPath);
  });

  test('returns the introductory sequence page', () => {
    const output = lib.findNextScreen(true, true, false, navigation.splashPath);
    expect(output).toEqual(navigation.introSequencePath);
  });

  test('returns the game page', () => {
    const output = lib.findNextScreen(true, true, true, navigation.splashPath);
    expect(output).toEqual(navigation.gamePath);
  });
});
