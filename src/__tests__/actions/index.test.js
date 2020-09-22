import ActionCreators from '../../actions/index';
import * as AchievementActions from '../../actions/achievements';
import * as DiagnosticActions from '../../actions/diagnostic';
import * as GenericActions from '../../actions/generic';
import * as HintsActions from '../../actions/hints';
import * as MapActions from '../../actions/map';
import * as PromptActions from '../../actions/prompts';
import * as ScoreActions from '../../actions/score';
import * as ScormActions from '../../actions/scorm';
import * as SettingsActions from '../../actions/settings';
import * as StreakActions from '../../actions/streak';
import * as TutorialActions from '../../actions/tutorial';

test('Action creators', () => {
  const mock = jest.fn();
  mock(ActionCreators);
  expect(mock).toHaveBeenCalledWith(expect.objectContaining({
    ...AchievementActions,
    ...DiagnosticActions,
    ...GenericActions,
    ...HintsActions,
    ...MapActions,
    ...PromptActions,
    ...ScoreActions,
    ...ScormActions,
    ...SettingsActions,
    ...StreakActions,
    ...TutorialActions,
  }));
});
