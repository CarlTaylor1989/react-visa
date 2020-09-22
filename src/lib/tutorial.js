import {
  networkMapPath,
  networkProductPath,
  clientsSelectorPath,
  proposalPath
} from '../config/navigation';
import tutorialIds from '../config/tutorials';

export const lib = {};
/**
 * Based on the location, it finds and returns the tutorial ID
 * @param {string} location The current game location
 * @return {string}
 */
lib.findTutorialId = (location) => {
  let tutorialId = '';
  switch (location) {
    case networkMapPath:
    case networkProductPath:
      tutorialId = 't4';
      break;
    case clientsSelectorPath:
    case proposalPath:
      tutorialId = 't3';
      break;
    default:
      tutorialId = 't1';
      break;
  }
  return tutorialId;
};

/**
 * Get the tutorial slide index
 * @param {string} id Tutorial ID
 * @return {number}
 */
lib.getTutorialSlideIndex = id => (tutorialIds[id] ? tutorialIds[id].slide : 0);

/**
 * Find and gets the tutorial slide index based on a given location
 * @param {string} location The current game location
 */
export const getLocationTutorialSlideIndex = (location) => {
  const tutorialId = lib.findTutorialId(location);
  return lib.getTutorialSlideIndex(tutorialId);
};
