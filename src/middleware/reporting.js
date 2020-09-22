import { I18n } from 'react-redux-i18n';
import * as streakTypes from '../actions/streakTypes';
import * as achievementTypes from '../actions/achievementTypes';
import * as clientTypes from '../actions/clientTypes';
import { sendInteractionData } from '../tracking/xapi/XApiAdapter';
import { CLIENT_COMPLETED, CLIENT_GIVENUP } from '../config/constants';
import { clientsPropsReferrer } from '../config/referrers';

export const totalScoreReady = ({ getState }) => next => (action) => {
  next(action);

  if (action.score) {
    const totalScore = getState().scoreData.total;
    sendInteractionData({
      type: 'scored',
      activity: {
        type: 'course'
      },
      result: {
        score: {
          raw: totalScore
        }
      }
    });
  }
};

export const bonusSreakAchieved = ({ getState }) => next => (action) => {
  let wasActive;
  let wasCompleted;
  if (action.type === streakTypes.INCREASE_STREAK) {
    const streakData = getState().streakData;
    wasActive = streakData.active;
    wasCompleted = streakData.wasCompleted;
  }

  next(action);

  if (action.type === streakTypes.INCREASE_STREAK) {
    const streakData = getState().streakData;

    if (wasActive && !wasCompleted && !streakData.active && streakData.completed) {
      sendInteractionData({
        type: 'achieved',
        activity: {
          id: 'streak/bonusstreak',
          type: 'goal',
          title: I18n.t('xapi.bonusstreak.title'),
          description: I18n.t('xapi.bonusstreak.description'),
        },
        parent: 'streak'
      });
    }
  }
};

export const bonusSreakLost = ({ getState }) => next => (action) => {
  let prevProgress;
  if (action.type === streakTypes.RESET_STREAK_PROGRESS) {
    prevProgress = getState().streakData.progress;
  }

  next(action);

  if (action.type === streakTypes.RESET_STREAK_PROGRESS) {
    const state = getState();
    const streakData = state.streakData;
    const mapData = state.mapData;

    if (streakData.active && prevProgress > 0) {
      const challenge = mapData.challenges.find(ch => (
        ch.id === action.challengeId && ch.familyId === action.familyId
      ));

      sendInteractionData({
        type: 'lost',
        activity: {
          id: 'streak/bonusstreak',
          type: 'goal',
          title: I18n.t('xapi.bonusstreak.title'),
          description: I18n.t('xapi.bonusstreak.description'),
        },
        parent: 'streak',
        other: {
          type: 'gomo',
          projectId: challenge.gomoId
        }
      });
    }
  }
};

export const rankChanged = ({ getState }) => next => (action) => {
  const previousRank = getState().scoreData.rank;

  next(action);

  const scoreData = getState().scoreData;
  if (action.score && previousRank && previousRank !== scoreData.rank) {
    sendInteractionData({
      type: 'achieved',
      activity: {
        id: `rank/${scoreData.rank}`,
        type: 'goal',
        title: I18n.t(`generic.ranks.${scoreData.rank}`),
        description: I18n.t('xapi.ranks.description', { value: scoreData.total })
      },
      parent: 'rank'
    });
  }
};

export const achievementsUnlocked = () => next => (action) => {
  next(action);

  if (action.type === achievementTypes.SET_COMPLETED_ACHIEVEMENT) {
    sendInteractionData({
      type: 'achieved',
      activity: {
        id: `achievements/${action.achievement}`,
        type: 'goal',
        title: I18n.t(`generic.achievements.${action.achievement}.title`),
        description: I18n.t(`generic.achievements.${action.achievement}.description`)
      },
      parent: 'achievements'
    });
  }
};

export const clientProposal = () => next => (action) => {
  next(action);

  if (action.type === clientTypes.SET_CLIENT_STATUS) {
    let verb = '';
    let succeeded = false;

    if (action.status === CLIENT_COMPLETED) {
      verb = 'completed';
      succeeded = true;
    } else if (action.status === CLIENT_GIVENUP) {
      verb = 'terminated';
    }

    if (action.status === CLIENT_COMPLETED || action.status === CLIENT_GIVENUP) {
      const problemType = I18n.t(`clientprops.clients.${action.client}.problemType`);
      sendInteractionData({
        type: verb,
        activity: {
          id: `${clientsPropsReferrer}/${action.client}`,
          type: 'assessment',
          title: I18n.t(`clientprops.clients.${action.client}.info.account`),
          description: I18n.t('xapi.client.completedDescription', {
            problem: I18n.t(`clientprops.problems.${problemType}.name`)
          })
        },
        result: {
          completion: true,
          success: succeeded
        },
        parent: clientsPropsReferrer
      });
    }
  }
};

export default [
  totalScoreReady,
  bonusSreakAchieved,
  bonusSreakLost,
  rankChanged,
  achievementsUnlocked,
  clientProposal
];
