import { I18n } from 'react-redux-i18n';
import clients, {
  CLIENT_LOCKED,
  STEP1_SCORES,
  STEP2_SCORES,
  REQUIREMENT_MAX_ATTEMPTS
} from '../config/clients';
import { CLIENT_COMPLETED, CLIENT_GIVENUP } from '../config/constants';
import { clientsPropsReferrer } from '../config/referrers';
import { sendInteractionData } from '../tracking/xapi/XApiAdapter';

export const lib = {};

/**
 * Send an xAPI statement for the client proposal product selection
 * @param {string} clientId The client ID
 * @param {array} availableChoices The available choices
 * @param {array} correctResponses The client proposal correct responses
 * @param {array} answers The learner's responses
 * @param {boolean} isCorrect Question answered correctly
 * @param {object} timeAvailable The time the popup became available
 * @param {number} questionIndex The question number
 */
export const sendClientQuestionStatement = (
  clientId,
  availableChoices,
  correctResponses,
  answers,
  isCorrect,
  timeAvailable,
  questionIndex
) => {
  const choices = [];

  availableChoices.forEach((choice) => {
    choices.push({
      id: choice.id,
      description: choice.text
    });
  });
  const problemType = I18n.t(`clientprops.clients.${clientId}.problemType`);

  sendInteractionData({
    type: 'answered',
    activity: {
      id: `${clientsPropsReferrer}/${clientId}/question-${questionIndex}`,
      type: 'choice',
      title: I18n.t('xapi.client.questionTitle', {
        name: I18n.t(`clientprops.clients.${clientId}.info.account`),
        index: questionIndex
      }),
      description: I18n.t('xapi.client.questionDescription', {
        name: I18n.t(`clientprops.clients.${clientId}.info.account`),
        problem: I18n.t(`clientprops.problems.${problemType}.name`),
        question: I18n.t(`xapi.client.question${questionIndex}`)
      }),
      correctResponses: [correctResponses.join(',')],
      choices
    },
    result: {
      completion: isCorrect,
      success: isCorrect
    },
    response: {
      detail: answers.join(','),
      timeAvailable,
      timeResponse: new Date()
    },
    parent: `${clientsPropsReferrer}/${clientId}`
  });
};

/**
 * Calculate number of wins
 * @param {object} data Client proposal state
 * @return {number}
 */
export const calculateTotalWins = (data) => {
  const keys = Object.keys(data);
  return keys
    .map(key => data[key])
    .filter(key => key.proposalCompleted && key.status === CLIENT_COMPLETED).length;
};

/**
 * Calculate number of losses
 * @param {object} data Client proposal state
 * @return {number}
 */
export const calculateTotalLosses = (data) => {
  const keys = Object.keys(data);
  return keys
    .map(key => data[key])
    .filter(key => key.proposalCompleted && key.status === CLIENT_GIVENUP).length;
};

/**
 * Checks if the selected statement is correct
 * @param {string} client The client ID
 * @param {string} statement The statement ID
 * @return {boolean}
 */
export const checkStatementCorrectness = (client, statement) => (
  clients[client].statements.includes(statement)
);

/**
 * Returns the number of correct statements for a given client
 * @param {string} client The client ID
 * @return {number}
 */
export const getNumberOfCorrectStatements = client => clients[client].statements.length;

/**
 * Client correct statements include given statement
 * @param {string} client The client ID
 * @param {string} stmId The statement ID
 * @return {boolean}
 */
lib.clientHasStatement = (client, stmId) => clients[client].statements.includes(stmId);

/**
 * Determine statement correctness and lock state
 * @param {string} client The client ID
 * @param {boolean} correct Client answered correctly
 * @param {string} stmId The statement ID
 * @return {object}
 */
export const getStatementStatus = (client, correct, stmId) => {
  const status = {
    disabled: false,
    selected: false
  };

  if (correct) {
    status.disabled = true;
    status.selected = lib.clientHasStatement(client, stmId);
  }

  return status;
};

/**
 * Determine the lock duration in seconds
 * @param {number} attempts The number of attempts
 * @return {number}
 */
export const getClientLockedDuration = (attempts) => {
  const times = attempts / REQUIREMENT_MAX_ATTEMPTS;
  return CLIENT_LOCKED[times] || CLIENT_LOCKED.max;
};

/**
 * Get the remaining locked duration in seconds
 * @param {number} start The time the client was locked
 * @param {number} duration The lock duration (in seconds)
 * @return {number}
 */
export const getRemainingLockedDuration = (start, duration) => {
  let remaining = 0;
  const end = start + duration * 1000;
  const current = new Date().getTime();

  if (end > current) {
    remaining = Math.round((end - current) / 1000);
  }

  return remaining;
};

/**
 * Gets the remaining attempts
 * @param {number} attempts Current attempts
 * @return {number}
 */
export const getRemainingAttempts = attempts => (
  (attempts % REQUIREMENT_MAX_ATTEMPTS) === 0
    ? 0
    : REQUIREMENT_MAX_ATTEMPTS - (attempts % REQUIREMENT_MAX_ATTEMPTS)
);

/**
 * Returns a list of the requirement statements for a client
 * @param {string} client The client ID
 * @return {array}
 */
export const getRequirementStatements = client => (
  Object.values(I18n.t(`clientprops.clients.${client}.statements`))
);

/**
 * Returns a list of the requirement statement IDs
 * @param {string} client The client ID
 * @return {array}
 */
export const getRequirementStatementIds = (client) => {
  const data = I18n.t(`clientprops.clients.${client}.statements`);
  return Object.keys(data)
    .map(value => I18n.t(`clientprops.clients.${client}.statements.${value}.id`));
};

/**
 * Check to see if the selected statement is correct
 * @param {string} client The client ID
 * @param {string} solution The solution ID
 * @return {boolean}
 */
export const checkSolutionCorrectness = (client, solution) => (
  clients[client].solutions.includes(solution)
);

/**
 * Returns the number of correct solutions for a given client
 * @param {string} client The client ID
 * @return {number}
 */
export const getNumberOfCorrectSolutions = client => clients[client].solutions.length;

/**
 * Returns a list of the requirement statement IDs
 * @param {string} client The client ID
 * @return {array}
 */
export const getClientDifficultyScore = (client) => {
  const difficulty = clients[client].difficulty;
  return STEP1_SCORES[difficulty];
};

/**
 * Determine solution correctness and lock state
 * @param {string} client The client ID
 * @param {boolean} correct Client answered correctly
 * @param {string} solId The solution ID
 * @return {object}
 */
export const getSolutionStatus = (client, correct, givenUp, solId) => {
  const status = {
    disabled: false,
    selected: false
  };

  if (correct) {
    status.disabled = true;
    status.selected = lib.clientHasSolution(client, solId);
  }

  if (givenUp) {
    status.disabled = true;
    status.selected = false;
  }

  return status;
};

/**
 * Client correct solutions include given solution
 * @param {string} client The client ID
 * @param {string} stmId The solution ID
 * @return {boolean}
 */
lib.clientHasSolution = (client, solId) => clients[client].solutions.includes(solId);

/**
 * Send an xAPI statement for every resource
 * @param {string} clientId The client ID
 * @param {string} resourceId The resource ID
 * @param {string} title The resouce title
 * @param {string} description The resource description
 * @param {object} timeAvailable The time the popup became available
 * @param {number} questionIndex The question number
 */
export const sendResourceStatement = (
  clientId,
  resourceId,
  title,
  description,
  timeAvailable,
  questionIndex
) => {
  sendInteractionData({
    type: 'experienced',
    activity: {
      id: `${clientsPropsReferrer}/${clientId}/question-${questionIndex}/${resourceId}`,
      type: 'slide',
      title,
      description
    },
    response: {
      timeAvailable,
      timeResponse: new Date()
    },
    parent: `${clientsPropsReferrer}/${clientId}/question-${questionIndex}`
  });
};

/**
 * Returns the score of a client proposal
 * @param {string} client The client ID
 * @param {number} noOfIncorrect The number of incorrect attempts
 * @return {number}
 */
export const getClientProposalScore = (client, noOfIncorrect) => {
  const difficulty = clients[client].difficulty;
  const score = STEP2_SCORES[difficulty] * (0.9 ** noOfIncorrect);
  return Math.round(score);
};
