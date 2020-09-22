export const groups = {
  challenges: 'challenges',
  products: 'products',
  proposals: 'proposals',
  scored: 'scored',
  settings: 'settings',
  timed: 'timed',
};

export default [
  {
    id: 'ac1',
    score: 5000,
    hidden: false,
    group: 'scored',
    max: 1,
    available: false
  }, {
    id: 'ac2',
    score: 5000,
    hidden: false,
    group: 'challenges',
    max: 1,
    available: false
  }, {
    id: 'ac3',
    score: 10000,
    hidden: false,
    group: 'products',
    max: 1,
    available: true
  }, {
    id: 'ac4',
    score: 50000,
    hidden: false,
    group: 'products',
    max: 5,
    available: false
  }, {
    id: 'ac5',
    score: 150000,
    hidden: false,
    group: 'products',
    max: 15,
    available: false
  }, {
    id: 'ac6',
    score: 250000,
    hidden: false,
    group: 'products',
    max: 25,
    available: false
  }, {
    id: 'ac7',
    score: 100000,
    hidden: true,
    group: 'timed',
    max: 5,
    available: true
  }, {
    id: 'ac8',
    score: 1,
    hidden: true,
    attempts: 5,
    group: 'proposals',
    available: true
  }, {
    id: 'ac9',
    score: 1111,
    hidden: false,
    group: 'scored',
    max: 1000000,
    available: true
  }, {
    id: 'ac10',
    score: 33333,
    hidden: false,
    group: 'scored',
    max: 3000000,
    available: true
  }, {
    id: 'ac11',
    score: 5555,
    hidden: true,
    group: 'scored',
    max: 5000000,
    available: true
  }, {
    id: 'ac12',
    score: 10101,
    hidden: true,
    group: 'scored',
    max: 10000000,
    available: true
  }, {
    id: 'ac13',
    score: 50000,
    hidden: false,
    group: 'proposals',
    available: false
  }, {
    id: 'ac14',
    score: 250000,
    hidden: false,
    group: 'proposals',
    max: 8,
    level: 1,
    available: false
  }, {
    id: 'ac15',
    score: 500000,
    hidden: false,
    group: 'proposals',
    max: 8,
    level: 2,
    available: false
  }, {
    id: 'ac16',
    score: 750000,
    hidden: false,
    group: 'proposals',
    max: 8,
    level: 3,
    available: false
  }, {
    id: 'ac17',
    score: 1000000,
    hidden: true,
    group: 'proposals',
    max: 24,
    allClients: true,
    available: false
  }, {
    id: 'ac18',
    score: 25000,
    hidden: true,
    attempts: 0,
    group: 'proposals',
    available: true
  }, {
    id: 'ac19',
    score: 5000,
    hidden: true,
    group: 'challenges',
    progress: 3,
    available: true
  }, {
    id: 'ac20',
    score: 1000000,
    hidden: true,
    group: 'challenges',
    max: 100,
    perfect: true,
    available: false
  }, {
    id: 'ac21',
    score: 5000,
    hidden: true,
    group: 'settings',
    max: 1,
    available: false
  }
];