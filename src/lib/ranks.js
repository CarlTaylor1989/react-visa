import _ from 'lodash';
import ranks, {
  defaultRank
} from '../config/ranks';

/**
 * Get rank ID based on a score
 * @param {number} score
 * @return {string}
 */
export const getRankId = (score) => {
  const sorted = _.orderBy(ranks, 'threshold', 'desc');
  const found = _.find(sorted, rank => rank.threshold <= score);
  if (found) {
    return found.id;
  }
  return defaultRank;
};

/**
 * @param {string} rankId
 */
export const getRankThreshold = (rankId) => {
  const found = _.find(ranks, rank => rank.id === rankId);
  return found.threshold;
};

/**
 * Gets the score range for a given rank
 * @param {string} id Rank ID
 * @return {array} [min, max] or [min]
 */
export const getRankRange = (id) => {
  const sorted = _.orderBy(ranks, 'threshold', 'desc');
  const currentIndex = _.findIndex(ranks, rank => rank.id === id);
  const range = [];
  if (currentIndex > 0) {
    range.push(sorted[currentIndex].threshold, sorted[currentIndex - 1].threshold);
  } else {
    range.push(sorted[currentIndex].threshold);
  }
  return range;
};

/**
 * Gets the percentage complete for a score within a rank range
 * @param {number} id Rank ID
 * @param {number} score User score
 * @return {number}
 */
export const getPercentageComplete = (id, score) => {
  const range = getRankRange(id);
  let percent;
  if (1 in range) {
    const rounded = _.round(((score - range[0]) / (range[1] - range[0])) * 100);
    percent = _.clamp(rounded, 0, 100);
  } else {
    percent = 100;
  }
  return percent;
};
