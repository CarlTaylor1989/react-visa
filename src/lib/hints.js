import hints, * as lib from '../config/hints';

/**
 * Filters groups by group into a new array.
 * @param {array} group Array of hints
 * @return {array}
 */
export const getHints = group => hints.filter(hint => hint.group === group);

/**
 * Gets the hint id for a hint based on it's group and index within that group.
 * @param {string} group Group name
 * @param {number} index Current index
 * @return {string | null}
 */
export const getHintId = (group, index) => {
  const hint = getHints(group)[index];
  return hint ? hint.id : null;
};

/**
 * Calculates whether a network hint is accessible.
 * @param {string} hintId Hint identifier
 * @param {object} state Game state
 * @return {boolean}
 */
export const networkHintAccessible = (hintId, state) => {
  let accessible = false;
  switch (hintId) {
    case 'h2':
      accessible = state.completedChallenges.length === 0;
      break;
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      accessible = state.completedChallenges.length > 0;
      break;
    case 'h7':
      accessible = state.completedProducts.length > 0;
      break;
    case 'h8':
      accessible = state.bonusStreak === 3;
      break;
    default:
      accessible = true;
      break;
  }

  return accessible;
};

/**
 * Calculates whether a product hint is accessible.
 * @param {string} hintId Hint identifier
 * @param {object} state Game state
 * @return {boolean}
 */
export const productHintAccessible = (hintId, state) => {
  let accessible = false;
  switch (hintId) {
    case 'h9':
      accessible = state.completedChallenges.length > 0;
      break;
    case 'h10':
      accessible = state.productPageInactive;
      break;
    default:
      accessible = true;
      break;
  }
  return accessible;
};

export const clientProposalHintAccesible = (hintId, state) => {
  let accessible = false;
  const {
    clients,
    clientShowing,
    displayReqFeedback
  } = state;
  const {
    reqCorrect
  } = clients.find(({ id }) => id === clientShowing);
  switch (hintId) {
    case 'h12':
      accessible = !reqCorrect || (reqCorrect && displayReqFeedback);
      break;
    case 'h13':
      accessible = (reqCorrect && !displayReqFeedback);
      break;
    default:
      accessible = true;
      break;
  }
  return accessible;
};

/**
 * Calculates whether a hint is accessible based on game state. Custom logic for many of the hints.
 * @param {string} group Group name
 * @param {string} hintId Hint identifier
 * @param {object} state Game state
 * @return {boolean}
 */
export const hintAccessible = (group, hintId, state) => {
  let accessible = false;
  if (typeof hintId === 'string') {
    switch (group) {
      case lib.HINT_NETWORK:
        accessible = networkHintAccessible(hintId, state);
        break;
      case lib.HINT_PRODUCT:
        accessible = productHintAccessible(hintId, state);
        break;
      case lib.HINT_CLIENT_PROPOSAL:
        accessible = clientProposalHintAccesible(hintId, state);
        break;
      case lib.HINT_DIAGNOSTIC:
      case lib.HINT_CLIENT_SELECTION:
      default:
        accessible = true;
        break;
    }
  }
  return accessible;
};

/**
 * Recursive function that finds the next valid array index from the
 * array of hints filtered by group, this function takes note of the starting index
 * and returns it if it is reached again as to not end up in a infinite loop of recursive
 * function calls if no hints are currently available for a hint group.
 *
 * @param {string} group Group name
 * @param {number} index Current index
 * @param {object} state Game state
 * @param {number} startingIndex Starting index
 * @return {number}
 */
const getNextHintIndexRecursive = (group, index, state, startingIndex) => {
  const size = getHints(group).length - 1;
  const nextIndex = (index + 1 > size) ? 0 : index + 1;
  const hintId = getHintId(group, nextIndex);
  return (hintAccessible(group, hintId, state) || nextIndex === startingIndex)
    ? nextIndex
    : getNextHintIndexRecursive(group, nextIndex, state, startingIndex);
};

/**
 * Function to find the next valid array index from the
 * array of hints filtered by group.
 * @param {string} group Group name
 * @param {number} index Current index
 * @param {object} state Game state
 * @return {number}
 */
export const getNextHintIndex = (group, index, state) => getNextHintIndexRecursive(
  group,
  index,
  state,
  index
);

/**
 * Gets the current hint index for the current hint group from
 * game state.
 * @param {array} hintsState Array of hints from game state
 * @param {string} group Group name from game state
 * @return {number}
 */
export const getHintIndexFromState = (hintsState, group) => {
  const currentGroup = hintsState.find(hint => hint.group === group);
  return (currentGroup) ? currentGroup.index : null;
};
