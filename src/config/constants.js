// Loader
export const REMOVE_LOADER_AFTER = 2000;

// Diagnostic
export const DIAGNOSTIC_NOT_STARTED = 0;
export const DIAGNOSTIC_STARTED = 1;
export const DIAGNOSTIC_COMPLETED = 2;

// Client statuses
export const CLIENT_NOT_STARTED = 0;
export const CLIENT_IN_PROGRESS = 1;
export const CLIENT_COMPLETED = 2;
export const CLIENT_LOCKED = 3;
export const CLIENT_GIVENUP = 4;

// Family statuses
export const FAMILY_INCOMPLETE_STATUS = 0;
export const FAMILY_COMPLETION_STATUS = 1;

// Challenge statuses
export const CHALLENGE_UNAVAILABLE_STATUS = -1;
export const CHALLENGE_AVAILABLE_STATUS = 0;
export const CHALLENGE_IN_PROGRESS_STATUS = 1;
export const CHALLENGE_FAILED_STATUS = 2;
export const CHALLENGE_COMPLETION_STATUS = 3;
export const CHALLENGE_PERFECT_STATUS = 4;

// Challenge CSS status classes
export const CHALLENGE_NOT_STARTED_CLASS = 'notStarted';
export const CHALLENGE_AVAILABLE_CLASS = 'available';
export const CHALLENGE_COMPLETED_CLASS = 'completed';
export const CHALLENGE_PERFECT_CLASS = 'perfect';

// Product CSS status classes
export const PRODUCT_INCOMPLETE_CLASS = 'incomplete';
export const PRODUCT_COMPLETED_CLASS = 'completed';

// SCO completion statuses and perfect score
export const SCO_PERFECT_SCORE = 100;
export const SCO_COMPLETION_PASSED = 'passed';
export const SCO_COMPLETION_FAILED = 'failed';
export const SCO_COMPLETION_UNKNOWN = 'unknown';

// Streak bonus
export const ACTIVATE_STREAK_AFTER = 14; // hours
export const MAXIMUM_STREAK = 4;

// Prompt types
export const ACHIEVEMENT_PROMPT = 'achievement';
export const RANK_PROMPT = 'rank';
export const PRODUCT_PROMPT = 'product';
export const BONUS_STREAK_PROMPT = 'bonusStreak';
export const EXIT_SUMMARY_PROMPT_AFTER = 5000;

// Consecutive days
export const CONSECUTIVE_LOWER = 14;
export const CONSECUTIVE_UPPER = 33;

// Tooltip delay
export const DISPLAY_TOOLTIPS_AFTER = 500; // miliseconds

// xAPI
export const XAPI_CHALLENGE_MIN_SCORE = 0;
export const XAPI_CHALLENGE_MAX_SCORE = 2;
export const XAPI_FAIL_CHALLENGE = 'fail';
export const XAPI_FAIL_CHALLENGE_SCORE = 0;
export const XAPI_COMPLETED_CHALLENGE = 'pass';
export const XAPI_COMPLETED_CHALLENGE_SCORE = 1;
export const XAPI_PERFECT_CHALLENGE = 'perfect';
export const XAPI_PERFECT_CHALLENGE_SCORE = 2;
export const XAPI_FEEDBACK_MIN_RATING = 1;
export const XAPI_FEEDBACK_MAX_RATING = 5;

// Cornerstone LMS URL
export const LMS_URL = 'https://visalms.csod.com/LMS/scorm/';

// Feedback
export const FEEDBACK_TRIGGER = 3;
