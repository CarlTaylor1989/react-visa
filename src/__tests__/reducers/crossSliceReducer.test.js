import * as scormTypes from '../../actions/scormTypes';
import crossSliceReducer from '../../reducers/crossSliceReducer';
import {
  prepareMapSuspendData,
  prepareScoreData,
  preparePromptsData
} from '../../tracking/scorm/SuspendData';

jest.mock('../../tracking/scorm/SuspendData');

test('returns the default state', () => {
  // setup
  const state = { foo: 'bar' };
  const action = { type: 'irrelevant' };

  // function under test
  const output = crossSliceReducer(state, action);

  // expectation
  expect(output).toEqual(expect.objectContaining(state));
});

describe('PREPARE_SUSPEND_DATA', () => {
  test('returns the state with the suspend data', () => {
    // setup
    const mapData = {};
    const promptsData = {};
    prepareMapSuspendData.mockImplementation(() => mapData);
    preparePromptsData.mockImplementation(() => promptsData);
    const state = {
      scormData: {
        learnerId: '123'
      },
      mapData: {
        challenges: [],
        initialised: true,
        families: []
      },
      settingsData: {
        audio: true,
        tooltips: false
      },
      diagnosticData: {
        completed: true,
        region: 'irrelevant',
        visited: true,
      },
      scoreData: {
        total: 1000,
        running: 200
      },
      achievementsData: {
        completed: ['foo'],
        lastCompleted: 'foo',
        completedThisSession: true,
        achievementChanged: false
      },
      streakData: {
        active: true,
        completed: false
      },
      genericData: {
        consecutive: 1,
        launched: 0,
        introSeqCompleted: false,
        foo: 'bar',
        clientIntroSeen: true,
        networkIntroSeen: true
      },
      promptsData: {
        achievements: [],
        bonusStreak: 0
      },
      clientProposalData: {
        foo: 'bar',
        clients: []
      },
      tutorialData: {
        launched: true
      }
    };
    prepareScoreData.mockImplementation(() => state.scoreData);
    const action = { type: scormTypes.PREPARE_SUSPEND_DATA };

    // function under test
    const output = crossSliceReducer(state, action);

    // expectation
    expect(output).toEqual(expect.objectContaining({
      scormData: {
        ...state.scormData,
        suspendData: {
          map: mapData,
          settings: {
            ...state.settingsData
          },
          diagnostic: {
            completed: state.diagnosticData.completed,
            region: state.diagnosticData.region,
            visited: state.diagnosticData.visited
          },
          score: {
            ...state.scoreData
          },
          achievements: {
            completed: state.achievementsData.completed,
            lastCompleted: state.achievementsData.lastCompleted,
            achievementChanged: state.achievementsData.achievementChanged
          },
          streak: {
            ...state.streakData
          },
          generic: {
            clientIntroSeen: state.genericData.clientIntroSeen,
            consecutive: state.genericData.consecutive,
            introSeqCompleted: state.genericData.introSeqCompleted,
            launched: state.genericData.launched,
            networkIntroSeen: state.genericData.networkIntroSeen
          },
          clientProposalData: {
            clients: []
          },
          tutorial: {
            launched: state.tutorialData.launched
          }
        }
      },
      mapData: {
        ...state.mapData
      },
      promptsData: {
        ...state.promptsData
      },
      settingsData: {
        ...state.settingsData
      },
      diagnosticData: {
        ...state.diagnosticData
      },
      scoreData: {
        ...state.scoreData
      },
      achievementsData: {
        ...state.achievementsData
      },
      streakData: {
        ...state.streakData
      },
      genericData: {
        ...state.genericData
      },
      clientProposalData: {
        ...state.clientProposalData
      },
      tutorialData: {
        ...state.tutorialData
      }
    }));
    expect(prepareMapSuspendData).toHaveBeenCalledWith(
      state.mapData.challenges,
      state.mapData.families
    );
    expect(prepareScoreData).toHaveBeenCalledWith(state.scoreData);
    expect(preparePromptsData).toHaveBeenCalledWith(state.promptsData);
  });

  test('returns the original suspend data', () => {
    // setup
    const mapData = {};
    const promptsData = {};
    prepareMapSuspendData.mockImplementation(() => mapData);
    preparePromptsData.mockImplementation(() => promptsData);
    const state = {
      scormData: {
        learnerId: '123',
        suspendData: {
          map: {
            foo: 'bar'
          }
        }
      },
      mapData: {
        challenges: [],
        initialised: false,
        families: []
      },
      settingsData: {},
      diagnosticData: {},
      achievementsData: {},
      streakData: {},
      genericData: {},
      tutorialData: {},
      clientProposalData: {
        clients: []
      },
    };
    const action = { type: scormTypes.PREPARE_SUSPEND_DATA };

    // function under test
    const output = crossSliceReducer(state, action);

    // expectation
    expect(output).toEqual(expect.objectContaining({
      ...state,
      scormData: {
        ...state.scormData,
        suspendData: expect.objectContaining({
          map: {
            ...state.scormData.suspendData.map
          }
        })
      }
    }));
    expect(prepareMapSuspendData).not.toHaveBeenCalled();
  });
});
