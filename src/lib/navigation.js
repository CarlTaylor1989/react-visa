import _ from 'lodash';
import {
  sequence,
  splashPath,
  diagnosticPath,
  introSequencePath,
  gamePath
} from '../config/navigation';

/**
 * Gets the next screen route
 * @param {string} current Current screen route
 * @returns {string}
 */
export const getNextScreen = (current) => {
  const currentIndex = _.findIndex(sequence, value => value.url === current);
  let nextPage = current;
  if (currentIndex > -1 && currentIndex < sequence.length - 1) {
    nextPage = sequence[currentIndex + 1].url;
  }
  return nextPage;
};

/**
 * Finds the next screen based on the intro and diagnostic completion
 * @param {boolean} diagnosticCompleted Diagnostic completion
 * @param {boolean} diagnosticVisited Diagnostic visited
 * @param {boolean} introCompleted Diagnostic visited
 * @param {string} current Current screen
 * @return {string}
 */
export const findNextScreen = (diagnosticCompleted, diagnosticVisited, introCompleted, current) => {
  let nextPage;
  if (diagnosticVisited && !diagnosticCompleted && current === splashPath) {
    nextPage = diagnosticPath;
  } else if (diagnosticCompleted && !introCompleted) {
    nextPage = introSequencePath;
  } else if (diagnosticCompleted && introCompleted) {
    nextPage = gamePath;
  } else {
    nextPage = splashPath;
  }
  return nextPage;
};
