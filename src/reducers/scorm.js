import { createReducer } from 'redux-create-reducer';
import { SCORM, debug } from 'pipwerks-scorm-api-wrapper';
import { cloneDeep } from 'lodash';
import * as types from '../actions/scormTypes';
import config from '../tracking/scorm/config.json';
import * as initialState from '../tracking/scorm/scormInitialState.json';
import {
  getDataModel,
  validateCompletionStatus
} from '../tracking/scorm/DataModel';
import { indexPath } from '../config/navigation';

const commit = (suspendData, completionStatus, location) => {
  SCORM.set('cmi.suspend_data', JSON.stringify(suspendData));
  SCORM.set(getDataModel('location'), location);
  SCORM.status('set', completionStatus);
  SCORM.save();
};

const scormData = createReducer(cloneDeep(initialState), {
  [types.INITIALISE_SCORM](state) {
    let scormInitialised = state.scormInitialised;
    let learnerName = state.learnerName;
    let learnerID = state.learnerID;
    let lessonLocation = state.lessonLocation;
    let suspendData = state.suspendData;

    if (!state.scormInitialised) {
      debug.isActive = config.debugMode;
      const version = config.version.substr(0, 4) === '2004' ? '2004' : '1.2';
      SCORM.version = version;
      const scorm = SCORM.init();

      if (scorm) {
        scormInitialised = true;
        learnerName = SCORM.get(getDataModel('student_name'));
        learnerID = SCORM.get(getDataModel('student_id'));
        lessonLocation = SCORM.get(getDataModel('location'));
        lessonLocation = lessonLocation === '' ? indexPath : lessonLocation;
        suspendData = SCORM.get('cmi.suspend_data');
        suspendData = suspendData && suspendData.length > 0 ? JSON.parse(suspendData) : {};
      }
    }

    return {
      ...state,
      scormInitialised,
      learnerName,
      learnerID,
      lessonLocation,
      suspendData
    };
  },
  [types.SET_LESSON_LOCATION](state, action) {
    if (state.scormInitialised && state.lessonLocation !== action.lessonLocation) {
      SCORM.set(getDataModel('location'), action.lessonLocation);
    }
    return {
      ...state,
      lessonLocation: action.lessonLocation
    };
  },
  [types.SET_COMPLETION_STATUS](state, action) {
    return {
      ...state,
      completionStatus: validateCompletionStatus(state.completionStatus, action.completionStatus)
    };
  },
  [types.SET_SUSPEND_DATA_ITEM](state, action) {
    return {
      ...state,
      suspendData: {
        ...state.suspendData,
        [action.item]: action.value
      }
    };
  },
  [types.SET_SCORM_VALUE](state, action) {
    return {
      ...state,
      [action.item]: action.value
    };
  },
  [types.COMMIT](state) {
    if (state.scormInitialised) {
      const currentData = { ...state.suspendData };
      commit(currentData, state.completionStatus, state.lessonLocation);
    }

    return {
      ...state
    };
  },
  [types.TERMINATE_SCORM](state) {
    let scormInitialised = state.scormInitialised;

    if (state.scormInitialised) {
      const currentData = { ...state.suspendData };
      commit(currentData, state.completionStatus, state.lessonLocation);
      const success = SCORM.quit();
      if (success) {
        scormInitialised = false;
      }
    }

    return {
      ...state,
      scormInitialised
    };
  }
});

export default { scormData };
