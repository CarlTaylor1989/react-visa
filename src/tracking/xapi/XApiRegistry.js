/**
 * XApi Registry
 * Activities, extentions and verbs are based on the tincapi registry
 * https://registry.tincanapi.com
 */
const XApiRegistry = {
  activities: {
    assessment: {
      name: 'Assessment',
      id: 'http://adlnet.gov/expapi/activities/assessment'
    },
    'cmi.interactions': {
      name: 'File',
      id: 'http://adlnet.gov/expapi/activities/cmi.interaction'
    },
    course: {
      name: 'Course',
      id: 'http://adlnet.gov/expapi/activities/course'
    },
    game: {
      name: 'game',
      id: 'http://activitystrea.ms/schema/1.0/game'
    },
    goal: {
      name: 'Goal',
      id: 'http://id.tincanapi.com/activitytype/goal'
    },
    interaction: {
      name: 'Interaction',
      id: 'http://adlnet.gov/expapi/activities/interaction'
    },
    link: {
      name: 'Link',
      id: 'http://adlnet.gov/expapi/activities/link'
    },
    media: {
      name: 'Media',
      id: 'http://adlnet.gov/expapi/activities/media'
    },
    meeting: {
      name: 'Meeting',
      id: 'http://adlnet.gov/expapi/activities/meeting'
    },
    module: {
      name: 'Module',
      id: 'http://adlnet.gov/expapi/activities/module'
    },
    objective: {
      name: 'Objective',
      id: 'http://adlnet.gov/expapi/activities/objective'
    },
    performance: {
      name: 'Performance',
      id: 'http://adlnet.gov/expapi/activities/performance'
    },
    question: {
      name: 'Question',
      id: 'http://adlnet.gov/expapi/activities/question'
    },
    simulation: {
      name: 'Simulation',
      id: 'http://adlnet.gov/expapi/activities/simulation'
    },
    slide: {
      name: 'slide',
      id: 'http://id.tincanapi.com/activitytype/slide'
    },
    'slide-deck': {
      name: 'slide-deck',
      id: 'http://id.tincanapi.com/activitytype/slide-deck'
    },
    survey: {
      name: 'survey',
      id: 'http://id.tincanapi.com/activitytype/survey'
    }
  },
  extensions: {
    'browser-info': {
      name: 'browser information',
      id: 'http://id.tincanapi.com/extension/browser-info'
    },
    duration: {
      name: 'duration',
      id: 'http://id.tincanapi.com/extension/duration'
    },
    referrer: {
      name: 'referrer',
      id: 'http://id.tincanapi.com/extension/referrer'
    }
  },
  verbs: {
    achieved: {
      name: 'achieved',
      id: 'https://w3id.org/xapi/dod-isd/verbs/achieved'
    },
    answered: {
      name: 'answered',
      id: 'http://adlnet.gov/expapi/verbs/answered'
    },
    asked: {
      name: 'asked',
      id: 'http://adlnet.gov/expapi/verbs/asked'
    },
    attempted: {
      name: 'attempted',
      id: 'http://adlnet.gov/expapi/verbs/attempted'
    },
    attended: {
      name: 'attended',
      id: 'http://adlnet.gov/expapi/verbs/attended'
    },
    commented: {
      name: 'commented',
      id: 'http://adlnet.gov/expapi/verbs/commented'
    },
    completed: {
      name: 'completed',
      id: 'http://adlnet.gov/expapi/verbs/completed'
    },
    exited: {
      name: 'exited',
      id: 'http://adlnet.gov/expapi/verbs/exited'
    },
    experienced: {
      name: 'experienced',
      id: 'http://adlnet.gov/expapi/verbs/experienced'
    },
    failed: {
      name: 'failed',
      id: 'http://adlnet.gov/expapi/verbs/failed'
    },
    imported: {
      name: 'imported',
      id: 'http://adlnet.gov/expapi/verbs/imported'
    },
    initialized: {
      name: 'initialized',
      id: 'http://adlnet.gov/expapi/verbs/initialized'
    },
    interacted: {
      name: 'interacted',
      id: 'http://adlnet.gov/expapi/verbs/interacted'
    },
    launched: {
      name: 'launched',
      id: 'http://adlnet.gov/expapi/verbs/launched'
    },
    lost: {
      name: 'lost',
      id: 'http://activitystrea.ms/schema/1.0/lose'
    },
    mastered: {
      name: 'mastered',
      id: 'http://adlnet.gov/expapi/verbs/mastered'
    },
    opened: {
      name: 'opened',
      id: 'http://activitystrea.ms/schema/1.0/open'
    },
    passed: {
      name: 'passed',
      id: 'http://adlnet.gov/expapi/verbs/passed'
    },
    preferred: {
      name: 'preferred',
      id: 'http://adlnet.gov/expapi/verbs/preferred'
    },
    progressed: {
      name: 'progressed',
      id: 'http://adlnet.gov/expapi/verbs/progressed'
    },
    rated: {
      name: 'rated',
      id: 'http://id.tincanapi.com/verb/rated'
    },
    received: {
      name: 'received',
      id: 'http://activitystrea.ms/schema/1.0/receive'
    },
    registered: {
      name: 'registered',
      id: 'http://adlnet.gov/expapi/verbs/registered'
    },
    responded: {
      name: 'responded',
      id: 'http://adlnet.gov/expapi/verbs/responded'
    },
    resumed: {
      name: 'resumed',
      id: 'http://adlnet.gov/expapi/verbs/resumed'
    },
    scored: {
      name: 'scored',
      id: 'http://adlnet.gov/expapi/verbs/scored'
    },
    shared: {
      name: 'shared',
      id: 'http://adlnet.gov/expapi/verbs/shared'
    },
    suspended: {
      name: 'suspended',
      id: 'http://adlnet.gov/expapi/verbs/suspended'
    },
    terminated: {
      name: 'terminated',
      id: 'http://adlnet.gov/expapi/verbs/terminated'
    },
    voided: {
      name: 'voided',
      id: 'http://adlnet.gov/expapi/verbs/voided'
    }
  }
};

export default XApiRegistry;
