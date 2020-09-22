import * as types from '../actions/streakTypes';
import { addBonusStreakPrompt } from '../actions/prompts';
import { increaseScore, increaseStreakBonus } from '../actions/score';
import { MAXIMUM_STREAK } from '../config/constants';
import { BONUS_STREAK_COMPLETED } from '../config/scores';

const streak = ({ getState, dispatch }) => next => (action) => {
  if (getState().streakData.active && action.type === types.INCREASE_STREAK) {
    next(action);
    if (getState().streakData.progress === MAXIMUM_STREAK) {
      dispatch(increaseScore(BONUS_STREAK_COMPLETED));
      dispatch(addBonusStreakPrompt());
      dispatch(increaseStreakBonus());
    }
  } else {
    next(action);
  }
};

export default streak;
