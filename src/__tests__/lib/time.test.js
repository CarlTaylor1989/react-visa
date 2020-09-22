import MockDate from 'mockdate';
import launchedWithinDays from '../../lib/time';

describe('function launchedWithinDays', () => {
  test('returns true', () => {
    // setup
    MockDate.set(1578614400 * 1000);
    // function under test
    const output = launchedWithinDays(1578528000 * 1000, 3);
    // expectation
    expect(output).toEqual(true);
  });

  test('returns false', () => {
    // setup
    MockDate.set(1578614400 * 1000);
    const output = launchedWithinDays(1578182400 * 1000, 3);
    expect(output).toEqual(false);
  });

  test('test with default params', () => {
    // setup
    MockDate.set(1578614400 * 1000);
    const output = launchedWithinDays(1578182400 * 1000);
    expect(output).toEqual(false);
  });
});
