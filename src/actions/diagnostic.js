import * as types from './diagnosticTypes';

export function setDiagnosticCompletion(completed) {
  return {
    type: types.SET_DIAGNOSTIC_COMPLETION,
    completed
  };
}

export function setDiagnosticVisited() {
  return {
    type: types.SET_DIAGNOSTIC_VISITED
  };
}

export function setRegion(region) {
  return {
    type: types.SET_REGION,
    region
  };
}

export function resetDiagnostic() {
  return {
    type: types.RESET_DIAGNOSTIC
  };
}

export function setDiagnosticData(data) {
  return {
    type: types.SET_DIAGNOSTIC_DATA,
    data
  };
}
