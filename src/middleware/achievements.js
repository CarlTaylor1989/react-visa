import _ from 'lodash';
import * as achievActions from '../actions/achievements';
import * as achievTypes from '../actions/achievementTypes';
import * as mapTypes from '../actions/mapTypes';
import * as promptActions from '../actions/prompts';
import * as scoreActions from '../actions/score';
import achievements, { groups } from '../config/achievements';
import {
  CHALLENGE_FAILED_STATUS,
  CHALLENGE_COMPLETION_STATUS,
  CHALLENGE_PERFECT_STATUS
} from '../config/constants';

const groupedAchievs = _.groupBy(achievements, ac => ac.group);

export const lib = {};
lib.getGroupedAchievements = group => groupedAchievs[group];

lib.dispatchActions = (dispatch, id, score) => {
  dispatch(achievActions.setCompletedAchievement(id));
  dispatch(promptActions.addAchievementPrompt(id));
  dispatch(scoreActions.increaseScore(score));
  dispatch(scoreActions.increaseAchievementsUnlocked());
};

export const challengeAchievements = ({ dispatch, getState }) => next => (action) => {
  next(action);

  if (action.type === mapTypes.UPDATE_CHALLENGE_STATUS) {
    const state = getState();
    const completedAchievements = state.achievementsData.completed;
    const completedChallenges = state.mapData.completedChallenges;
    const streakProgres = state.streakData.progress;
    const challengeAchiev = lib.getGroupedAchievements(groups.challenges);

    challengeAchiev.forEach((ac) => {
      if (!completedAchievements.includes(ac.id)) {
        if (ac.available && ((ac.max && completedChallenges.length === ac.max
          && (action.status === CHALLENGE_COMPLETION_STATUS
            || action.status === CHALLENGE_PERFECT_STATUS))
          || (streakProgres === ac.progress && action.status === CHALLENGE_FAILED_STATUS))) {
          lib.dispatchActions(dispatch, ac.id, ac.score);
        }
      }
    });
  }
};

export const productAchievements = ({ dispatch, getState }) => next => (action) => {
  next(action);

  if (action.type === mapTypes.ADD_COMPLETED_PRODUCT) {
    const state = getState();
    const competedProducts = state.mapData.completedProducts;
    const completedAchievements = state.achievementsData.completed;
    const productAchiev = lib.getGroupedAchievements(groups.products);

    productAchiev.forEach((ac) => {
      if (ac.available && competedProducts.length === ac.max
          && !completedAchievements.includes(ac.id)) {
        lib.dispatchActions(dispatch, ac.id, ac.score);
      }
    });
  }
};

export const settingsAchievement = ({ dispatch, getState }) => next => (action) => {
  next(action);

  if (action.type === achievTypes.UPDATE_SETTINGS_ACHIEVEMENTS) {
    const completedAchievements = getState().achievementsData.completed;
    const settingsAchiev = lib.getGroupedAchievements(groups.settings);

    settingsAchiev.forEach((ac) => {
      if (ac.available && !completedAchievements.includes(ac.id)) {
        lib.dispatchActions(dispatch, ac.id, ac.score);
      }
    });
  }
};

export const timedAchievement = ({ dispatch, getState }) => next => (action) => {
  next(action);

  if (action.type === achievTypes.UPDATE_TIMED_ACHIEVEMENTS) {
    const state = getState();
    const completedAchievements = state.achievementsData.completed;
    const consecutive = state.genericData.consecutive;
    const timedAchiev = lib.getGroupedAchievements(groups.timed);

    timedAchiev.forEach((ac) => {
      if (ac.available && !completedAchievements.includes(ac.id) && consecutive === ac.max) {
        lib.dispatchActions(dispatch, ac.id, ac.score);
      }
    });
  }
};

export const scoredAchievements = ({ dispatch, getState }) => next => (action) => {
  next(action);

  // Do we have a scoring action which sets the score?
  if (action.score) {
    const state = getState();
    const completedAchievements = state.achievementsData.completed;
    const totalScore = state.scoreData.total;
    const scoredAchiev = lib.getGroupedAchievements(groups.scored);

    scoredAchiev.forEach((ac) => {
      if (ac.available && !completedAchievements.includes(ac.id) && ac.max <= totalScore) {
        lib.dispatchActions(dispatch, ac.id, ac.score);
      }
    });
  }
};

export default [
  challengeAchievements,
  productAchievements,
  settingsAchievement,
  timedAchievement,
  scoredAchievements
];
