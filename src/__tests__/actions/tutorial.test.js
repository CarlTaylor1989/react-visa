import * as actions from '../../actions/tutorial';
import * as types from '../../actions/tutorialTypes';

test('method setTutorialSlideIndex()', () => {
  const slideIndex = 1;
  const output = actions.setTutorialSlideIndex(slideIndex);
  expect(output).toEqual({
    type: types.SET_TUTORIAL_SLIDE_INDEX,
    slideIndex
  });
});

test('method setTutorialLaunched()', () => {
  const launched = true;
  const output = actions.setTutorialLaunched(launched);
  expect(output).toEqual({
    type: types.SET_TUTORIAL_LAUNCHED,
    launched
  });
});
