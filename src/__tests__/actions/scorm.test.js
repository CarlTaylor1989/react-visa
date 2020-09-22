import * as actions from '../../actions/scorm';
import * as types from '../../actions/scormTypes';

test('method initialiseScorm()', () => {
  const output = actions.initialiseScorm();
  expect(output).toEqual({
    type: types.INITIALISE_SCORM
  });
});

test('method setCompletionStatus()', () => {
  const completionStatus = 'completed';
  const output = actions.setCompletionStatus(completionStatus);
  expect(output).toEqual({
    type: types.SET_COMPLETION_STATUS,
    completionStatus
  });
});

test('method setSuspendDataItem()', () => {
  const item = 'foo';
  const value = 'bar';
  const output = actions.setSuspendDataItem(item, value);
  expect(output).toEqual({
    type: types.SET_SUSPEND_DATA_ITEM,
    item,
    value
  });
});

test('method setScormValue()', () => {
  const item = 'foo';
  const value = 'bar';
  const output = actions.setScormValue(item, value);
  expect(output).toEqual({
    type: types.SET_SCORM_VALUE,
    item,
    value
  });
});

test('method commit()', () => {
  const output = actions.commit();
  expect(output).toEqual({
    type: types.COMMIT
  });
});

test('method terminateScorm()', () => {
  const output = actions.terminateScorm();
  expect(output).toEqual({
    type: types.TERMINATE_SCORM
  });
});

test('method prepareSuspendData()', () => {
  const output = actions.prepareSuspendData();
  expect(output).toEqual({
    type: types.PREPARE_SUSPEND_DATA
  });
});
