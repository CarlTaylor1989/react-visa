import { commit, prepareSuspendData } from '../actions/scorm';

export const saveScoreData = ({ dispatch, getState }) => next => (action) => {
  const previousScore = getState().scoreData.total;

  next(action);

  const currentScore = getState().scoreData.total;

  // Do we have a scoring action and a new rank?
  if (action.score && previousScore !== currentScore) {
    dispatch(prepareSuspendData());
    dispatch(commit());
  }
};

export default [
  saveScoreData
];
