import _ from 'lodash';
import {
  CHALLENGE_AVAILABLE_STATUS,
  CHALLENGE_IN_PROGRESS_STATUS,
  CHALLENGE_FAILED_STATUS,
  CHALLENGE_COMPLETION_STATUS,
  CHALLENGE_PERFECT_STATUS
} from '../../config/constants';

/**
 * Prepare map suspend data (families, products and challenges)
 * @param {array} challenges Game challenges
 * @return {object}
 */
export const prepareMapSuspendData = (challenges) => {
  const mapData = {};

  const famData = {};
  challenges.forEach((challenge) => {
    if (!famData[challenge.familyId]) {
      famData[challenge.familyId] = [];
    }
    famData[challenge.familyId].push({
      id: challenge.id,
      status: challenge.status
    });
  });

  const data = [];
  _.forOwn(famData, (chs, family) => {
    const familyData = {
      id: family
    };
    const perfect = [];
    const completed = [];
    const failed = [];
    const inprogress = [];
    const available = [];
    const unavailable = [];

    chs.forEach((ch) => {
      switch (ch.status) {
        case CHALLENGE_PERFECT_STATUS:
          perfect.push(ch.id);
          break;
        case CHALLENGE_COMPLETION_STATUS:
          completed.push(ch.id);
          break;
        case CHALLENGE_FAILED_STATUS:
          failed.push(ch.id);
          break;
        case CHALLENGE_IN_PROGRESS_STATUS:
          inprogress.push(ch.id);
          break;
        case CHALLENGE_AVAILABLE_STATUS:
          available.push(ch.id);
          break;
        default: // CHALLENGE_UNAVAILABLE_STATUS
          unavailable.push(ch.id);
          break;
      }
    });

    if (perfect.length) {
      familyData.perfect = perfect;
    }
    if (completed.length) {
      familyData.completed = completed;
    }
    if (failed.length) {
      familyData.failed = failed;
    }
    if (inprogress.length) {
      familyData.inprogress = inprogress;
    }
    if (available.length) {
      familyData.available = available;
    }
    if (unavailable.length) {
      familyData.unavailable = unavailable;
    }
    data.push(familyData);
  });

  if (data.length) {
    mapData.families = data;
  }

  return mapData;
};

/**
 * Parses the score data and it returns the properties with values
 * @param {object} scoreData The state score data
 * @return {object}
 */
export const prepareScoreData = (scoreData) => {
  const data = {
    rank: scoreData.rank,
    running: scoreData.running,
    total: scoreData.total
  };

  _.forIn(scoreData.categories, (value, key) => {
    if (value > 0) {
      if (!data.categories) {
        data.categories = {};
      }
      data.categories[key] = value;
    }
  });

  return data;
};

/**
 * Parses the prompt data and it returns the properties with values
 * @param {object} scoreData The state prompt data
 * @return {object}
 */
export const preparePromptsData = (promptData) => {
  const data = {};

  if (promptData.achievements.length) {
    data.achievements = promptData.achievements;
  }

  if (promptData.bonusStreak) {
    data.bonusStreak = promptData.bonusStreak;
  }

  if (promptData.products.length) {
    data.products = promptData.products;
  }

  if (promptData.ranks.length) {
    data.ranks = promptData.ranks;
  }

  return _.keys(data).length ? { prompts: data } : {};
};
