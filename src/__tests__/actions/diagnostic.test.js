import * as actions from '../../actions/diagnostic';
import * as types from '../../actions/diagnosticTypes';

test('method setDiagnosticCompletion()', () => {
  const completed = true;
  const output = actions.setDiagnosticCompletion(completed);
  expect(output).toEqual({
    type: types.SET_DIAGNOSTIC_COMPLETION,
    completed
  });
});

test('method setDiagnosticVisited()', () => {
  const output = actions.setDiagnosticVisited();
  expect(output).toEqual({
    type: types.SET_DIAGNOSTIC_VISITED
  });
});

test('method setRegion()', () => {
  const region = 'eu';
  const output = actions.setRegion(region);
  expect(output).toEqual({
    type: types.SET_REGION,
    region
  });
});

test('method resetDiagnostic()', () => {
  const output = actions.resetDiagnostic();
  expect(output).toEqual({
    type: types.RESET_DIAGNOSTIC
  });
});

test('method setDiagnosticData()', () => {
  // setup
  const completed = true;
  const region = 'eu';
  const visited = true;
  const data = {
    completed,
    region,
    visited
  };

  // function under test
  const output = actions.setDiagnosticData(data);

  // expectation
  expect(output).toEqual({
    type: types.SET_DIAGNOSTIC_DATA,
    data
  });
});
