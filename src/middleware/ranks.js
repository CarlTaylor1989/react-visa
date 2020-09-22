import { addRankPrompt } from '../actions/prompts';

const ranks = ({ dispatch, getState }) => next => (action) => {
  const previousRank = getState().scoreData.rank;

  next(action);

  const currentRank = getState().scoreData.rank;

  // Do we have a scoring action and a new rank?
  if (action.score && previousRank !== currentRank) {
    dispatch(addRankPrompt(currentRank));
  }
};

export default ranks;
