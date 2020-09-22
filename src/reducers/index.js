import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import { i18nReducer } from 'react-redux-i18n';
import { connectRouter } from 'connected-react-router';

import achievementsReducer from './achievements';
import audioReducer from './audio';
import clientsReducer from './clients';
import diagnosticReducer from './diagnostic';
import genericReducer from './generic';
import hintsReducer from './hints';
import mapReducer from './map';
import promptsReducer from './prompts';
import scoreReducer from './score';
import scormReducer from './scorm';
import settingsReducer from './settings';
import streakReducer from './streak';
import tutorialReducer from './tutorial';
import crossSliceReducer from './crossSliceReducer';

export const combinedReducers = history => combineReducers((
  Object.assign(
    {}, {
      i18n: i18nReducer,
      router: connectRouter(history)
    },
    achievementsReducer,
    audioReducer,
    clientsReducer,
    diagnosticReducer,
    genericReducer,
    hintsReducer,
    mapReducer,
    promptsReducer,
    scoreReducer,
    scormReducer,
    settingsReducer,
    streakReducer,
    tutorialReducer
  )));

const rootReducer = history => reduceReducers(combinedReducers(history), crossSliceReducer);

export default rootReducer;
