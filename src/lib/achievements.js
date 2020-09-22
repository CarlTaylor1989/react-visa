import _ from 'lodash';
import achievements, { groups } from '../config/achievements';

export const lib = {};

/**
 * Gets achievements sorted by score descending.
 * @return {array}
 */
lib.sortedAchievements = () => _.orderBy(achievements, 'score', 'desc');

/**
 * Gets the percentage complete for an achievement based
 * on how many tasks have been completed.
 * @param {number} completed Total completed
 * @param {number} total     Total tasks
 * @return {number}
 */
lib.getPercentageComplete = (completed, total) => {
  let percent;
  if (completed > 0) {
    const rounded = _.round((completed / total) * 100);
    percent = _.clamp(rounded, 0, 100);
  } else {
    percent = 0;
  }
  return percent;
};

/**
 * Returns achievements with their completion data.
 * @param {object} data The data required to get the achievement status
 * @return {object}
 */
export const getUserAchievementData = (data) => {
  let sortedAchv = lib.sortedAchievements();
  sortedAchv = _.filter(sortedAchv, ach => ach.available !== false);
  return sortedAchv.map((achievement) => {
    const complete = data.completed.includes(achievement.id);
    let completion = {
      complete,
      completedAmount: 0,
      completedPercent: complete ? 100 : 0,
      totalAmount: achievement.max || 1
    };
    switch (achievement.group) {
      case groups.scored: {
        const completedAmount = (data.total > completion.totalAmount)
          ? completion.totalAmount
          : data.total;
        completion = {
          ...completion,
          completedAmount,
          completedPercent: lib.getPercentageComplete(completedAmount, completion.totalAmount)
        };
        break;
      }
      case groups.challenges: {
        if (achievement.max) {
          if (achievement.perfect) {
            completion.completedAmount = complete ? achievement.max : data.noOfPerfectChallenges;
            completion.completedPercent = lib.getPercentageComplete(
              data.noOfPerfectChallenges,
              achievement.max
            );
          } else {
            completion.completedAmount = complete ? achievement.max : data.noOfCompletedChallenges;
            completion.completedPercent = lib.getPercentageComplete(
              data.noOfCompletedChallenges,
              achievement.max
            );
          }
        } else if (achievement.progress && complete) {
          completion.completedAmount = 1;
        }
        break;
      }
      case groups.products: {
        completion = {
          ...completion,
          completedAmount: complete ? achievement.max : data.noOfCompletedProducts,
          completedPercent: lib.getPercentageComplete(data.noOfCompletedProducts, achievement.max)
        };
        break;
      }
      case groups.timed: {
        completion.completedAmount = complete ? achievement.max : data.noOfConsecutiveDays;
        if (!complete) {
          completion.completedPercent = lib.getPercentageComplete(
            data.noOfConsecutiveDays,
            achievement.max
          );
        }
        break;
      }
      case groups.settings: {
        if (completion.complete) {
          completion = {
            ...completion,
            completedAmount: 1
          };
        }
        break;
      }
      case groups.proposals:
        if (achievement.level || achievement.allClients) {
          const completed = data.clients.filter(cl => (
            cl.completed
            && (achievement.allClients || (achievement.level && cl.level === achievement.level))
          ));
          completion.completedAmount = completed.length;
          completion.completedPercent = lib.getPercentageComplete(
            completion.completedAmount,
            achievement.max
          );
        } else {
          completion.completedAmount = completion.complete ? 1 : 0;
        }
        break;
      default: {
        completion.completedAmount = completion.complete ? 1 : 0;
        break;
      }
    }

    return {
      ...achievement,
      completion
    };
  });
};
