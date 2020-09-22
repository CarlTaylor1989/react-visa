import PropTypes from 'prop-types';
import _ from 'lodash';
import { GoToScreen, newScreenConnect } from '../generic/GoToScreen';
import { hideLoader } from '../../lib/app';
import { initialiseLrs } from '../../tracking/xapi/XApiAdapter';
import { indexPath } from '../../config/navigation';
import { gameReferrer } from '../../config/referrers';

export class LoadingNav extends GoToScreen {
  componentDidMount() {
    const { scormInitialised } = this.props;
    if (process.env.PLATFORM === 'local') {
      this.findAndGoToScreen();
    } else if (scormInitialised) {
      this.onScormReady();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      dataReady,
      scormInitialised,
      setScreenReferrer,
      updateTimedAchievements
    } = this.props;

    if (!prevProps.scormInitialised && scormInitialised) {
      this.onScormReady();
    }

    if (prevProps.dataReady !== dataReady) {
      updateTimedAchievements();
      hideLoader();
      setScreenReferrer(gameReferrer);
      this.goToSplashScreen();
    }
  }

  onScormReady() {
    const {
      learnerID,
      learnerName,
      lessonLocation,
      suspendData,
      suspendDataParsed
    } = this.props;

    // Initialise LRS
    if (learnerID && learnerName) {
      initialiseLrs(
        {
          id: learnerID,
          name: learnerName
        },
        lessonLocation !== indexPath
      );
    }

    // Retrieve game setting from the suspend data
    if (suspendData && !_.isEmpty(suspendData)) {
      this.retrieveDataFromSuspendData(suspendData);
    }

    suspendDataParsed(true);
  }

  retrieveDataFromSuspendData(suspendData) {
    const {
      addPrompts,
      restoreAchievements,
      setCategories,
      setDiagnosticData,
      setGenericData,
      setRank,
      setSettings,
      setScores,
      setStreak,
      setClientProposalData,
      setTutorialLaunched
    } = this.props;

    // Set retrieved settings
    if (suspendData.settings) {
      setSettings(suspendData.settings);
    }

    // Set diagnostic completion
    if (suspendData.diagnostic) {
      setDiagnosticData(suspendData.diagnostic);
    }

    // Set retrieved scores
    if (suspendData.score) {
      setRank(suspendData.score.rank);
      setScores(suspendData.score.running, suspendData.score.total);

      if (suspendData.score.categories) {
        setCategories(suspendData.score.categories);
      }
    }

    // Set retrieved streak data
    if (suspendData.streak) {
      setStreak(suspendData.streak);
    }

    // Set retrieved generic data
    if (suspendData.generic) {
      setGenericData(suspendData.generic);
    }

    // Set the retrieved prompt data
    if (suspendData.prompts) {
      addPrompts(suspendData.prompts);
    }

    // set the achievements data
    if (suspendData.achievements) {
      restoreAchievements(
        suspendData.achievements.completed,
        suspendData.achievements.lastCompleted
      );
    }

    // set the client data
    if (suspendData.clientProposalData) {
      setClientProposalData(suspendData.clientProposalData);
    }

    // set the tutorial data
    if (suspendData.tutorial) {
      setTutorialLaunched(suspendData.tutorial.launched);
    }
  }

  render() {
    return null;
  }
}

LoadingNav.propTypes = {
  addPrompts: PropTypes.func.isRequired,
  scormInitialised: PropTypes.bool.isRequired,
  dataReady: PropTypes.bool.isRequired,
  learnerID: PropTypes.string.isRequired,
  learnerName: PropTypes.string.isRequired,
  lessonLocation: PropTypes.string.isRequired,
  restoreAchievements: PropTypes.func.isRequired,
  suspendData: PropTypes.object.isRequired,
  setCategories: PropTypes.func.isRequired,
  setDiagnosticData: PropTypes.func.isRequired,
  setGenericData: PropTypes.func.isRequired,
  setRank: PropTypes.func.isRequired,
  setScreenReferrer: PropTypes.func.isRequired,
  setSettings: PropTypes.func.isRequired,
  setScores: PropTypes.func.isRequired,
  setStreak: PropTypes.func.isRequired,
  suspendDataParsed: PropTypes.func.isRequired,
  updateTimedAchievements: PropTypes.func.isRequired,
  setClientProposalData: PropTypes.func.isRequired,
  setTutorialLaunched: PropTypes.func.isRequired
};

export const mapStateToProps = state => ({
  dataReady: state.genericData.dataReady,
  learnerID: state.scormData.learnerID,
  learnerName: state.scormData.learnerName,
  lessonLocation: state.scormData.lessonLocation,
  suspendData: state.scormData.suspendData,
  scormInitialised: state.scormData.scormInitialised,
});

export default newScreenConnect(LoadingNav, mapStateToProps);
