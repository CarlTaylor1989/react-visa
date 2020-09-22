import _ from 'lodash';

/**
 *
 * @param {number} completed
 * @param {number} total
 * @return {number}
 */
const getPercentageComplete = (completed, total) => _.round((completed / total) * 100);

export default getPercentageComplete;
