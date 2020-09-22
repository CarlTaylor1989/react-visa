import * as types from './scormTypes';

export function initialiseScorm() {
  return {
    type: types.INITIALISE_SCORM
  };
}

export function setLessonLocation(lessonLocation) {
  return {
    type: types.SET_LESSON_LOCATION,
    lessonLocation
  };
}

export function setCompletionStatus(completionStatus) {
  return {
    type: types.SET_COMPLETION_STATUS,
    completionStatus
  };
}

export function setSuspendDataItem(item, value) {
  return {
    type: types.SET_SUSPEND_DATA_ITEM,
    item,
    value
  };
}

export function setScormValue(item, value) {
  return {
    type: types.SET_SCORM_VALUE,
    item,
    value
  };
}

export function commit() {
  return {
    type: types.COMMIT
  };
}

export function terminateScorm() {
  return {
    type: types.TERMINATE_SCORM
  };
}

export function prepareSuspendData() {
  return {
    type: types.PREPARE_SUSPEND_DATA
  };
}
