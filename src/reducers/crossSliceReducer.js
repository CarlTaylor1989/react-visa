import * as scormTypes from '../actions/scormTypes';
import {
  prepareMapSuspendData,
  prepareScoreData,
  preparePromptsData
} from '../tracking/scorm/SuspendData';

const crossSliceReducer = (state, action) => {
  switch (action.type) {
    case scormTypes.PREPARE_SUSPEND_DATA: {
      return {
        ...state,
        scormData: {
          ...state.scormData,
          suspendData: {
            map: state.mapData.initialised ? prepareMapSuspendData(
              state.mapData.challenges,
              state.mapData.families
            ) : state.scormData.suspendData.map,
            clientProposalData: {
              clients: state.clientProposalData.clients
            },
            settings: {
              ...state.settingsData
            },
            diagnostic: {
              completed: state.diagnosticData.completed,
              region: state.diagnosticData.region,
              visited: state.diagnosticData.visited
            },
            score: prepareScoreData(state.scoreData),
            achievements: {
              completed: state.achievementsData.completed,
              lastCompleted: state.achievementsData.lastCompleted,
              achievementChanged: state.achievementsData.achievementChanged
            },
            streak: {
              ...state.streakData
            },
            generic: {
              consecutive: state.genericData.consecutive,
              launched: state.genericData.launched,
              feedback: state.genericData.feedback,
              introSeqCompleted: state.genericData.introSeqCompleted,
              clientIntroSeen: state.genericData.clientIntroSeen,
              networkIntroSeen: state.genericData.networkIntroSeen
            },
            tutorial: {
              launched: state.tutorialData.launched
            },
            ...preparePromptsData(state.promptsData)
          },
        }
      };
    }
    default:
      return state;
  }
};

export default crossSliceReducer;
