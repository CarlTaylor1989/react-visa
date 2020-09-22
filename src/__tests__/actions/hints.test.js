import * as actions from '../../actions/hints';
import * as types from '../../actions/hintsTypes';

test('function setCurrentHintGroup()', () => {
  const group = 'diagnostic';
  const output = actions.setCurrentHintGroup(group);
  expect(output).toEqual({
    type: types.SET_CURRENT_HINT_GROUP,
    group
  });
});

test('function setHintGroupIndex()', () => {
  const hints = { group: 'diagnostic', index: 1 };
  const output = actions.setHintGroupIndex(hints);
  expect(output).toEqual({
    type: types.SET_HINT_GROUP_INDEX,
    hints
  });
});

test('function setHintsPaused()', () => {
  const paused = true;
  const output = actions.setHintsPaused(paused);
  expect(output).toEqual({
    type: types.SET_HINTS_PAUSED,
    paused
  });
});
