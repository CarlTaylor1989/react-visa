import { createHashHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import {
  loadTranslations,
  setLocale,
  syncTranslationWithStore
} from 'react-redux-i18n';
import middleware from './middleware/index';
import reducers from './reducers/index';

export const history = createHashHistory({
  hashType: 'slash'
});

const langauge = process.env.REACT_APP_LANGUAGE || 'en_us';
const translations = require(`./translations/${langauge}/index`).default; // eslint-disable-line import/no-dynamic-require

const logger = createLogger({});
// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancers = composeEnhancers(applyMiddleware(
  routerMiddleware(history),
  thunkMiddleware,
  logger,
  ...middleware
));

const configureStore = initialState => (
  createStore(reducers(history), initialState, enhancers)
);

// Create store
const store = configureStore({});

// Set default language
syncTranslationWithStore(store);
store.dispatch(loadTranslations(translations));
store.dispatch(setLocale(langauge));

export default store;
