import { push } from 'connected-react-router';
import * as AchievementActions from './achievements';
import * as AudioActions from './audio';
import * as ClientActions from './client';
import * as DiagnosticActions from './diagnostic';
import * as GenericActions from './generic';
import * as HintsActions from './hints';
import * as MapActions from './map';
import * as PromptActions from './prompts';
import * as ScoreActions from './score';
import * as ScormActions from './scorm';
import * as SettingsActions from './settings';
import * as StreakActions from './streak';
import * as TutorialActions from './tutorial';

const ActionCreators = Object.assign(
  {},
  AchievementActions,
  AudioActions,
  ClientActions,
  DiagnosticActions,
  GenericActions,
  HintsActions,
  MapActions,
  PromptActions,
  ScoreActions,
  ScormActions,
  SettingsActions,
  StreakActions,
  TutorialActions,
  { push }
);

export default ActionCreators;
