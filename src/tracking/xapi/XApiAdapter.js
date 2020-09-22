import TinCan from 'tincanjs';
import _ from 'lodash';
import XApiRegistry from './XApiRegistry';
import config from './config.json';
import { cleanupText } from '../../lib/htmlutils';

const langauge = process.env.REACT_APP_LANGUAGE || 'en_us';
const xApiLang = process.env.XAPI_LANGUAGE || 'en-US';
const content = require(`../../translations/${langauge}/xapi/index`).default; // eslint-disable-line import/no-dynamic-require

const uuidv4 = require('uuid/v4');

let lrsInstance = null;
let startTime = null;
let agentAccount;
const interactionTypes = [
  'truefalse',
  'choice',
  'fill-in',
  'long-fill-in',
  'matching',
  'performance',
  'sequencing',
  'likert',
  'numeric',
  'other'
];

export const lib = {};

lib.log = (msg) => {
  if (config.debugMode) {
    console.log(msg); // eslint-disable-line no-console
  }
};

/**
 * Returns the endpoint details based on the platform
 * @return {object}
 */
lib.getEndpointDetails = () => {
  let endpointDetails;
  if (process.env.PLATFORM === 'local') {
    endpointDetails = {
      endpoint: process.env.DEV_ENDPOINT_URL,
      username: process.env.DEV_ENDPOINT_KEY,
      password: process.env.DEV_ENDPOINT_SECRET
    };
  } else if (process.env.PLATFORM === 'test') {
    endpointDetails = {
      endpoint: process.env.LEO_TEST_ENDPOINT_URL,
      username: process.env.LEO_TEST_ENDPOINT_KEY,
      password: process.env.LEO_TEST_ENDPOINT_SECRET
    };
  } else if (process.env.MODE === 'test') { // production + test
    endpointDetails = {
      endpoint: process.env.VISA_TEST_ENDPOINT_URL,
      username: process.env.VISA_TEST_ENDPOINT_KEY,
      password: process.env.VISA_TEST_ENDPOINT_SECRET
    };
  } else { // production + live
    endpointDetails = {
      endpoint: process.env.VISA_LIVE_ENDPOINT_URL,
      username: process.env.VISA_LIVE_ENDPOINT_KEY,
      password: process.env.VISA_LIVE_ENDPOINT_SECRET
    };
  }
  return endpointDetails;
};

/**
 * Create agent account definition
 * @param {object} learner The learner email and name
 * @return {object}
 */
lib.createAgentAccount = (learner) => {
  const agent = {};
  const uuid = uuidv4();
  if (learner && learner.id) {
    if (learner.id.includes('@')) {
      agent.mbox = learner.id;
    } else {
      agent.account = {
        homePage: config.homePage,
        name: learner.id
      };
    }
  } else {
    agent.mbox = `${uuid}.xapiuser@leolearning.com`;
  }
  if (learner && learner.name) {
    agent.name = learner.name;
  } else {
    agent.name = `User: ${uuid}`;
  }
  return agent;
};

/**
 * Create course activity object
 * @return {object}
 */
lib.getMainActivity = () => ({
  type: 'course',
  id: config.gameName,
  title: content.course.title,
  description: content.course.description
});

/**
 * Get browser info from the navigator
 * @return {object}
 */
lib.getBrowserInfo = () => ({
  code_name: navigator.appCodeName,
  name: navigator.appName,
  version: navigator.appVersion,
  platform: navigator.platform,
  'user-agent-header': navigator.userAgent,
  'cookies-enabled': navigator.cookieEnabled
});

/**
 * Parse URSL and extract the parameters
 * @param {string} url URL to parse
 */
lib.parseURL = (url) => {
  // Create result object
  const result = {
    url: '',
    params: {},
    original: url
  };
  // Parse the URL
  if (url.includes('?')) {
    const parts = url.split('?');
    result.url = parts[0];
    const params = parts[1].split('&');
    for (let x = 0; x < params.length; x += 1) {
      const param = params[x].split('=');
      result.params[param[0]] = param[1];
    }
  }
  // Return the results object
  return result;
};

/**
 * Replace delimiters with correct xapi ones.
 * @param {string} value
 */
lib.formatDelimiters = (value) => {
  let formatted = value;
  formatted = formatted.replace(/,/g, '[,]');
  formatted = formatted.replace(/\./g, '[.]');
  return formatted;
};

/**
 * Get launched URL and protocol
 * @param {object} location The window location object
 * @return {object}
 */
lib.getLaunchedURL = (location) => {
  let url = location.toString();
  const urlParts = url.split(':');
  let protocol = 'http';
  if (url && urlParts.length) {
    protocol = urlParts.shift().toLowerCase();
    protocol = (protocol === 'http' || protocol === 'https' ? protocol : 'http');
    url = `${protocol}:${urlParts.join(':')}`;
  }
  return {
    url,
    protocol
  };
};

/**
 * Create verb object
 * @param {string} verb Verb name
 * @return {object}
 */
lib.createVerb = (verb) => {
  const registeredVerb = XApiRegistry.verbs[verb];
  if (registeredVerb === undefined) {
    lib.log(`Verb ${verb} not in the registry`);
    return '';
  }
  return new TinCan.Verb({
    id: registeredVerb.id,
    display: {
      [xApiLang]: registeredVerb.name
    }
  });
};

/**
 * Create activity object
 * @param {string} activity Activity name
 * @param {object} extra Override activity definition
 * @return {object}
 */
lib.createActivity = (activity, extra) => {
  let newActivity = activity;
  const newExtra = extra;
  if (typeof activity === 'string') {
    newActivity = { type: activity };
  } else {
    newActivity = activity || {};
  }

  let activityId = '';
  let activityDefinition = {};

  // Set the registered activity details...
  const registeredActivity = XApiRegistry.activities[newActivity.type];
  if (registeredActivity !== undefined) {
    activityId = registeredActivity.id;
    activityDefinition.name = {
      [xApiLang]: registeredActivity.name
    };
    activityDefinition.type = registeredActivity.id;
  }

  if (!newActivity.id && newActivity.type === 'course') {
    newActivity = Object.assign(newActivity, lib.getMainActivity());
  }

  // Override with any user specified.
  if (newActivity && newActivity.id && newActivity.type) {
    if (newActivity.type === 'course' && !newActivity.gomoCourse) {
      activityId = config.baseURL + newActivity.id;
    } else if (newActivity.type === 'course' && newActivity.gomoCourse) {
      activityId = config.gomoCourseURL + newActivity.id;
    } else {
      activityId = `${config.baseURL}${config.gameName}/${newActivity.id}`;
    }
  }

  // Override with any user specified.
  if (newActivity.title !== undefined && newActivity.title) {
    activityDefinition.name = {
      [xApiLang]: cleanupText(newActivity.title)
    };
  }

  if (newActivity.description !== undefined && newActivity.description) {
    activityDefinition.description = {
      [xApiLang]: cleanupText(newActivity.description)
    };
  }

  if (newActivity.extensions) {
    activityDefinition.extensions = newActivity.extensions;
  }

  if (newActivity.type && interactionTypes.includes(newActivity.type)) {
    // @see {@link https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#requirements-4}
    activityDefinition.type = XApiRegistry.activities['cmi.interactions'].id;
    // @see {@link https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#details-10}
    activityDefinition.interactionType = newActivity.type;
  }

  // Format any question options and reponses
  if (newActivity.correctResponses && _.isArray(newActivity.correctResponses)) {
    newActivity.correctResponses = newActivity.correctResponses.map(cr => lib.formatDelimiters(cr));
  }

  if (newExtra && newExtra.result) {
    if (newExtra.result.response && _.isString(newExtra.result.response)) {
      newExtra.result.response = lib.formatDelimiters(newExtra.result.response);
    }

    if (newExtra.result.extensions) {
      newExtra.result.extensions = {
        [config.extensionURL + newExtra.result.extensions.name]: newExtra.result.extensions.value
      };
    }
  }


  if (newActivity.choices) {
    activityDefinition.choices = newActivity.choices.map(choice => ({
      id: choice.id,
      description: {
        [xApiLang]: cleanupText(choice.description)
      }
    }));
  }

  if (newActivity.correctResponses) {
    activityDefinition.correctResponsesPattern = newActivity.correctResponses;
  }

  // Override definition if a statement has defined its own.
  if (newExtra && newExtra.object && newExtra.object.definition) {
    activityDefinition = newExtra.object.definition;
  }

  if (activityId && activityDefinition) {
    // Create the activity
    return new TinCan.Activity({
      id: activityId,
      definition: activityDefinition
    });
  }

  lib.log('Failed to create activity');
  return null;
};

/**
 * Create agent object
 * @return {object}
 */
lib.createAgent = (agent) => {
  let xapiAgent = null;
  if (_.isObject(agent) && !_.isEmpty(agent)) {
    xapiAgent = new TinCan.Agent(agent);
  }
  return xapiAgent;
};

lib.getLRSInstance = () => lrsInstance;

lib.setLRSInstance = (lrs) => {
  let result = false;
  if (lrs && !lrsInstance) {
    lrsInstance = lrs;
    result = true;
  }
  return result;
};

/**
 * Create result object
 * @param {object} resultObj
 */
lib.createResult = (resultObj) => {
  const result = resultObj || {};

  if (result.score && _.isObject(result.score)) {
    result.score.raw = Number.isNaN(+result.score.raw) ? 0 : +result.score.raw;
    // Create a TinCan score object
    result.score = new TinCan.Score(result.score);
  }

  // Create and return TinCan result object
  return new TinCan.Result(result);
};

/**
 * Send xapi statement
 * @param {string} verb Statement verb
 * @param {string} activity Statement activity name
 * @param {object} extra Activity definition override
 */
lib.sendStatement = (verb, activity, extra) => {
  const lrs = lib.getLRSInstance();
  if (!lrs) return;

  const tcVerb = lib.createVerb(verb);
  if (typeof tcVerb !== 'object') {
    return;
  }

  // Create statement definition
  const statementDefinition = {
    actor: lib.createAgent(agentAccount || lib.createAgentAccount()),
    verb: tcVerb,
    target: lib.createActivity(activity, extra),
    version: config.version,
    context: {}
  };

  // Add any context information
  if (extra && extra.context) {
    statementDefinition.context = extra.context;
  }

  // Add any result information
  if (extra && extra.result && !_.isEmpty(extra.result)) {
    statementDefinition.result = lib.createResult(extra.result);
  }

  if (!statementDefinition.context.contextActivities) {
    statementDefinition.context.contextActivities = {};
  }

  // Add grouping to all statements
  statementDefinition.context.contextActivities.grouping = [{
    id: config.baseURL + config.gameName,
    objectType: 'Activity'
  }];

  // Create statement and save it
  const statement = new TinCan.Statement(statementDefinition);

  lrs.saveStatement(
    statement,
    {
      callback: (err, xhr) => {
        if (err !== null) {
          if (xhr !== null) {
            lib.log(`Failed to save statement: ${xhr.responseText} (${xhr.status})`); // eslint-disable-line max-len, no-console
          } else {
            lib.log(`Failed to send statement ${err}`); // eslint-disable-line no-console
          }
        } else {
          lib.log('Statement saved'); // eslint-disable-line no-console
        }
      }
    }
  );
};

/**
 * Content launched or resumed
 * @param {boolean} resumed Course either resumed or launched for first time
 */
lib.sendLaunchedResumed = (resumed) => {
  const activity = lib.getMainActivity();
  const extra = {
    context: {
      extensions: {
        [XApiRegistry.extensions['browser-info'].id]: lib.getBrowserInfo()
      }
    }
  };

  lib.sendStatement(resumed ? 'resumed' : 'launched', activity, extra);
};

/**
 * Get state from the LRS
 * @param {string} stateId
 * @param {string} activity
 * @return {object}
 */
lib.getState = (stateId, activity) => {
  const lrs = lib.getLRSInstance();
  if (!lrs) return {};

  let result = lrs.retrieveState(stateId, {
    agent: lib.createAgent(agentAccount),
    activity: lib.createActivity(activity),
    contentType: 'application/json'
  });

  if (result && !result.err && result.state && result.state.contents) {
    result = result.state.contents;
  } else {
    result = {};
  }
  return result;
};

/**
 * Set state to the LRS
 * @param {string} stateId
 * @param {string} stateData
 * @param {string} activity
 * @param {function} callback
 */
lib.saveState = (stateId, stateData, activity, callback) => {
  const lrs = lib.getLRSInstance();
  if (!lrs) return;

  lrs.saveState(stateId, stateData, {
    agent: lib.createAgent(agentAccount),
    activity: lib.createActivity(activity),
    contentType: 'application/json',
    callback
  });
};

/**
 * Create an TinCan compatible duration from two date/time stamps.
 * @param {data} start
 * @param {data} end
 * @return {string}
 */
lib.createDuration = (start, end) => {
  let duration = '';
  if (start instanceof Date && end instanceof Date) {
    const msecs = end.getTime() - start.getTime();
    duration = TinCan.Utils.convertMillisecondsToISO8601Duration(msecs);
  }
  return duration;
};

/**
 * Parse result
 * The results object will conform to the one defined in TinCan v1.0.0 spec.
 * @param {object} result The result object to be formatted.
 * @return {object}
 */
lib.parseResult = (resultToParse) => {
  const result = resultToParse || {};
  // Score object
  if (result.score && _.isObject(result.score)) {
    result.score.raw = Number.isNaN(+result.score.raw) ? 0 : +result.score.raw;
  }
  // Success status
  if (result.success !== undefined) {
    result.success = result.success || false;
  }

  // Completion status
  if (result.completion !== undefined) {
    result.completion = result.completion || false;
  }

  return result;
};

/**
 * Create referrer extension
 * @param {string} referrer The referrer
 * @return {object}
 */
lib.createReferrerExtension = referrer => ({
  [XApiRegistry.extensions.referrer.id]: {
    id: `${config.baseURL}${config.gameName}/${referrer}`,
    objectType: 'Activity'
  }
});

/**
 * Parse the interaction data
 * @param {Object} data
 * @return {Object}
 */
lib.parseInteractionData = (data) => {
  const interactionData = _.merge(data || {});
  interactionData.type = interactionData.type || '';
  interactionData.activity = interactionData.activity || {};
  interactionData.activity.id = interactionData.activity.id || '';
  interactionData.activity.title = interactionData.activity.title || ''; // eslint-disable-line max-len
  interactionData.activity.type = interactionData.activity.type || '';
  interactionData.result = lib.parseResult(interactionData.result);

  const extra = {
    result: _.clone(interactionData.result)
  };

  // if a statement has explicitly defined object data then use it
  if (_.isObject(interactionData.object)) {
    extra.object = interactionData.object;
  }

  if (_.isObject(interactionData.response)) {
    // populate result.response from response.detail
    if (_.isString(interactionData.response.detail)) {
      extra.result.response = interactionData.response.detail;
    }

    // populate result.duration from response.timeAvailable and response.timeResponse
    if (_.isDate(interactionData.response.timeAvailable)
      && _.isDate(interactionData.response.timeResponse)) {
      extra.result.duration = lib.createDuration(
        interactionData.response.timeAvailable,
        interactionData.response.timeResponse
      );
    }
  }

  if (interactionData.referrer) {
    extra.context = {
      extensions: lib.createReferrerExtension(interactionData.referrer)
    };
  }

  if (_.has(interactionData, 'parent') || interactionData.other) {
    extra.context = extra.context || {};
    extra.context.contextActivities = {};
  }

  if (_.has(interactionData, 'parent')) {
    const parent = interactionData.parent ? `/${interactionData.parent}` : '';
    extra.context.contextActivities.parent = [{
      id: `${config.baseURL}${config.gameName}${parent}`,
      objectType: 'Activity'
    }];
  }

  if (interactionData.other && interactionData.other.type === 'gomo') {
    extra.context.contextActivities.other = [{
      id: config.gomoCourseURL + interactionData.other.projectId,
      objectType: 'Activity'
    }];
  }

  return {
    interactionData,
    extra
  };
};

/**
 * Send interaction data
 * @param {object} data
 */
export const sendInteractionData = (data) => {
  const parsedData = lib.parseInteractionData(data);
  lib.sendStatement(
    parsedData.interactionData.type,
    parsedData.interactionData.activity,
    parsedData.extra
  );
};
lib.sendInteractionData = sendInteractionData;

/**
 * Create LRS store object
 * @param {object} data LRS config
 */
lib.createLRSStore = () => {
  const endpointConfig = lib.getEndpointDetails();
  const currentStore = {
    ...endpointConfig
  };

  const launchedUrl = lib.getLaunchedURL(window.location.toString());

  // Add the protocol if necessary
  if (currentStore.endpoint && /^\/\//.test(currentStore.endpoint)) {
    currentStore.endpoint = `${launchedUrl.protocol}:${currentStore.endpoint}`;
  }

  const parsedURL = lib.parseURL(currentStore.endpoint);
  if (parsedURL.url) {
    currentStore.endpoint = parsedURL.url;
    currentStore.extended = parsedURL.params;
  }

  return currentStore;
};

/**
 * Initialise LRS
 * @param {object} learner The learner name and email
 * @param {boolean} resumed Content resumed or launched for first time
 */
export const initialiseLrs = (learner, resumed) => {
  let lrs = lib.getLRSInstance();
  if (!lrs) {
    const currentStore = lib.createLRSStore();

    try {
      lrs = new TinCan.LRS({
        ...currentStore,
        allowFail: false
      });
      const result = lib.setLRSInstance(lrs);
      if (result) {
        lib.log('Connection established'); // eslint-disable-line no-console
      }

      if (config.debugMode) {
        TinCan.enableDebug();
      }

      startTime = new Date();
      agentAccount = lib.createAgentAccount(learner);
      lib.sendLaunchedResumed(resumed);
    } catch (e) {
      lib.log(`Failed to setup LRS object: ${JSON.stringify(e)}`); // eslint-disable-line no-console
    }
  }
};

/**
 * Terminate communication with the LRS
 */
export const exitLrs = () => {
  const endTime = new Date();
  const duration = lib.createDuration(startTime, endTime);
  const courseActivity = lib.getMainActivity();

  // Add duration to the result block
  const extra = {
    result: { duration }
  };

  lib.sendStatement('exited', courseActivity, extra);
  lrsInstance = null;
};
