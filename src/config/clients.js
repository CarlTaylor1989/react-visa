export const REQUIREMENT_MAX_ATTEMPTS = 3;
export const CLIENT_LOCKED = { // in seconds
  1: 60, // 1 minute
  2: 120, // 2 minutes
  3: 300, // 5 minutes
  4: 600, // 10 minutes
  max: 600, // 10 minutes
};
export const STEP1_SCORES = {
  1: 50000,
  2: 100000,
  3: 150000
};
export const STEP2_SCORES = {
  1: 100000,
  2: 200000,
  3: 300000
};

export default {
  client1: {
    difficulty: 1,
    statements: ['st1', 'st2', 'st5', 'st9'],
    solutions: ['prod1', 'prod2'],
    challenges: 1,
    goals: 1,
    opportunities: 2
  },
  client2: {
    difficulty: 1,
    statements: ['st2', 'st4', 'st6', 'st9', 'st11'],
    solutions: ['prod1', 'prod2'],
    challenges: 2,
    goals: 3,
    opportunities: 0
  },
  client3: {
    difficulty: 3,
    statements: ['st1', 'st2', 'st5', 'st9'],
    solutions: ['prod1', 'prod2'],
    challenges: 1,
    goals: 1,
    opportunities: 2
  },
  client4: {
    difficulty: 1,
    statements: ['st2', 'st3', 'st6', 'st9', 'st11', 'st12'],
    solutions: ['prod1', 'prod2'],
    challenges: 2,
    goals: 4,
    opportunities: 0
  },
  client5: {
    difficulty: 2,
    statements: ['st1', 'st2', 'st5', 'st9'],
    solutions: ['prod1', 'prod2'],
    challenges: 1,
    goals: 1,
    opportunities: 2
  },
  client6: {
    difficulty: 3,
    statements: ['st1', 'st2', 'st5', 'st9'],
    solutions: ['prod1', 'prod2'],
    challenges: 1,
    goals: 1,
    opportunities: 2
  },
  client7: {
    difficulty: 1,
    statements: ['st1', 'st2', 'st5', 'st9'],
    solutions: ['prod1', 'prod2'],
    challenges: 1,
    goals: 1,
    opportunities: 2
  },
  client8: {
    difficulty: 2,
    statements: ['st1', 'st2', 'st5', 'st9'],
    solutions: ['prod1', 'prod2'],
    challenges: 1,
    goals: 1,
    opportunities: 2
  },
  client9: {
    difficulty: 3,
    statements: ['st1', 'st2', 'st5', 'st9'],
    solutions: ['prod1', 'prod2'],
    challenges: 1,
    goals: 1,
    opportunities: 2
  },
  client10: {
    difficulty: 1,
    statements: ['st1', 'st2', 'st5', 'st9'],
    solutions: ['prod1', 'prod2'],
    challenges: 1,
    goals: 1,
    opportunities: 2
  }
};
