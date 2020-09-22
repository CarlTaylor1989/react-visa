import _ from 'lodash';
import {
  CHALLENGE_UNAVAILABLE_STATUS,
  CHALLENGE_IN_PROGRESS_STATUS,
  CHALLENGE_AVAILABLE_STATUS,
  CHALLENGE_FAILED_STATUS,
  CHALLENGE_COMPLETION_STATUS,
  CHALLENGE_PERFECT_STATUS,
  CHALLENGE_NOT_STARTED_CLASS,
  CHALLENGE_AVAILABLE_CLASS,
  CHALLENGE_COMPLETED_CLASS,
  CHALLENGE_PERFECT_CLASS,
  FAMILY_INCOMPLETE_STATUS,
  FAMILY_COMPLETION_STATUS,
  SCO_COMPLETION_PASSED,
  SCO_COMPLETION_FAILED,
  SCO_COMPLETION_UNKNOWN,
  SCO_PERFECT_SCORE,
  XAPI_FAIL_CHALLENGE,
  XAPI_FAIL_CHALLENGE_SCORE,
  XAPI_COMPLETED_CHALLENGE,
  XAPI_COMPLETED_CHALLENGE_SCORE,
  XAPI_PERFECT_CHALLENGE,
  XAPI_PERFECT_CHALLENGE_SCORE
} from '../config/constants';

export const lib = {};

lib.determineFamilyStatus = (data) => {
  let status;
  if (data.failed || data.inprogress || data.available || data.unavailable) {
    status = FAMILY_INCOMPLETE_STATUS;
  } else {
    status = FAMILY_COMPLETION_STATUS;
  }
  return status;
};

lib.getStoredChallengeStatus = (data) => {
  const challenges = {
    [data.id]: {}
  };

  if (data.perfect) {
    data.perfect.forEach((ch) => {
      challenges[data.id][ch] = CHALLENGE_PERFECT_STATUS;
    });
  }

  if (data.completed) {
    data.completed.forEach((ch) => {
      challenges[data.id][ch] = CHALLENGE_COMPLETION_STATUS;
    });
  }

  if (data.failed) {
    data.failed.forEach((ch) => {
      challenges[data.id][ch] = CHALLENGE_FAILED_STATUS;
    });
  }

  if (data.inprogress) {
    data.inprogress.forEach((ch) => {
      challenges[data.id][ch] = CHALLENGE_IN_PROGRESS_STATUS;
    });
  }

  if (data.available) {
    data.available.forEach((ch) => {
      challenges[data.id][ch] = CHALLENGE_AVAILABLE_STATUS;
    });
  }

  if (data.unavailable) {
    data.unavailable.forEach((ch) => {
      challenges[data.id][ch] = CHALLENGE_UNAVAILABLE_STATUS;
    });
  }

  return challenges;
};

export const getStoredMapData = (suspendData) => {
  const families = [];
  let challenges = {};

  if (suspendData && suspendData.map && suspendData.map.families
    && suspendData.map.families.length) {
    suspendData.map.families.forEach((family) => {
      families.push({
        id: family.id,
        status: lib.determineFamilyStatus(family)
      });

      challenges = {
        ...challenges,
        ...lib.getStoredChallengeStatus(family)
      };
    });
  }

  return {
    families,
    challenges
  };
};

/**
 * Gets the challenge status from the stored data
 * @param {array} challenges A list of stored challenges
 * @param {string} challengeId Challenge ID
 * @param {string} familyId Family ID
 * @param {boolean} isFirst Is the challenge the first in the product line
 * @return {number}
 */
export const getStoredChallengeStatus = (challenges, challengeId, familyId, isFirst) => {
  let status;

  if (challenges[familyId] && challenges[familyId][challengeId] !== undefined) {
    status = challenges[familyId][challengeId];
  } else if (isFirst) {
    status = CHALLENGE_AVAILABLE_STATUS;
  } else {
    status = CHALLENGE_UNAVAILABLE_STATUS;
  }

  return status;
};

/**
 * Determines the challenge status from the SCORM data
 * @param {string} status The completion status
 * @param {number} score The SCO score
 * @return {number}
 */
export const determineChallengeStatus = (status, score) => {
  let challengeStatus = CHALLENGE_AVAILABLE_STATUS;
  if (status === SCO_COMPLETION_PASSED) {
    if (score === SCO_PERFECT_SCORE) {
      challengeStatus = CHALLENGE_PERFECT_STATUS;
    } else {
      challengeStatus = CHALLENGE_COMPLETION_STATUS;
    }
  } else if (status === SCO_COMPLETION_FAILED) {
    challengeStatus = CHALLENGE_FAILED_STATUS;
  } else if (status === SCO_COMPLETION_UNKNOWN) {
    challengeStatus = CHALLENGE_IN_PROGRESS_STATUS;
  }
  return challengeStatus;
};

/**
 * Determines the class of an element and whether it's disabled or not based on the challeng status
 * @param {number} status The current challenge status
 * @return {object} An object with the class name and the disabled status
 */
export const getChallengeStatus = (status) => {
  let className = '';
  let disabled = false;
  switch (status) {
    case CHALLENGE_UNAVAILABLE_STATUS:
      className = CHALLENGE_NOT_STARTED_CLASS;
      disabled = true;
      break;
    case CHALLENGE_AVAILABLE_STATUS:
    case CHALLENGE_IN_PROGRESS_STATUS:
    case CHALLENGE_FAILED_STATUS:
      className = CHALLENGE_AVAILABLE_CLASS;
      break;
    case CHALLENGE_COMPLETION_STATUS:
      className = CHALLENGE_COMPLETED_CLASS;
      break;
    case CHALLENGE_PERFECT_STATUS:
      className = CHALLENGE_PERFECT_CLASS;
      break;
    default:
      className = CHALLENGE_NOT_STARTED_CLASS;
      break;
  }
  return {
    className,
    disabled
  };
};

/**
 * Returns the next available challenge index
 * @param {array} challenges A list of challenges
 * @return {number}
 */
export const getNextChallengeIndex = (challenges) => {
  const found = _.findIndex(challenges, ch => (
    ch.status === CHALLENGE_AVAILABLE_STATUS
    || ch.status === CHALLENGE_IN_PROGRESS_STATUS
    || ch.status === CHALLENGE_FAILED_STATUS
  ));
  return found < 0 ? challenges.length - 1 : found;
};

/**
 * Returns the challenge source data
 * @param {object} challenge The challenge from the game state
 * @param {object} challenges A dictionary of families with list of challenges
 */
export const findChallengeInChallenges = (challenge, challenges) => (
  challenges[challenge.familyId].find(ch => (
    ch.id === challenge.id && ch.productId === challenge.productId
  ))
);

/**
 * Gets the  status and score for the xAPI statement
 * @param {number} challengeStatus The challenge status
 * @return {object}
 */
export const getChallengeXAPIStatus = (status) => {
  const xApiStatus = {
    response: '',
    score: XAPI_FAIL_CHALLENGE_SCORE,
    success: true
  };

  switch (status) {
    case CHALLENGE_COMPLETION_STATUS:
      xApiStatus.response = XAPI_COMPLETED_CHALLENGE;
      xApiStatus.score = XAPI_COMPLETED_CHALLENGE_SCORE;
      break;
    case CHALLENGE_PERFECT_STATUS:
      xApiStatus.response = XAPI_PERFECT_CHALLENGE;
      xApiStatus.score = XAPI_PERFECT_CHALLENGE_SCORE;
      break;
    case CHALLENGE_UNAVAILABLE_STATUS:
    case CHALLENGE_AVAILABLE_STATUS:
    case CHALLENGE_IN_PROGRESS_STATUS:
    case CHALLENGE_FAILED_STATUS:
    default:
      xApiStatus.response = XAPI_FAIL_CHALLENGE;
      xApiStatus.score = XAPI_FAIL_CHALLENGE_SCORE;
      xApiStatus.success = false;
      break;
  }

  return xApiStatus;
};
