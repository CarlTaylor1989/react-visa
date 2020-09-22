import * as types from './tutorialTypes';

export const setTutorialSlideIndex = slideIndex => ({
  type: types.SET_TUTORIAL_SLIDE_INDEX,
  slideIndex
});

export const setTutorialLaunched = launched => ({
  type: types.SET_TUTORIAL_LAUNCHED,
  launched
});
