import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../../actions/index';
import { diagnosticPath, splashPath } from '../../config/navigation';
import { getNextScreen, findNextScreen } from '../../lib/navigation';

export class GoToScreen extends Component {
  constructor(props) {
    super(props);
    this.onGoToScreen = this.onGoToScreen.bind(this);
    this.goToNextScreen = this.goToNextScreen.bind(this);
    this.goToScreenAfter = this.goToScreenAfter.bind(this);
    this.findAndGoToScreen = this.findAndGoToScreen.bind(this);
    this.onChangeRegion = this.onChangeRegion.bind(this);
    this.onHoverBtn = this.onHoverBtn.bind(this);
  }

  onChangeRegion() {
    const { resetDiagnostic } = this.props;
    resetDiagnostic();
    this.onGoToScreen(diagnosticPath);
  }

  onGoToScreen(screenId) {
    const {
      commit,
      prepareSuspendData,
      push,
      setLessonLocation
    } = this.props;
    if (screenId) {
      setLessonLocation(screenId);
      push(screenId);
      prepareSuspendData();
      commit();
    }
  }

  onHoverBtn() {
    const { setPlayAudio } = this.props;
    setPlayAudio('au6');
  }

  goToNextScreen() {
    const { lessonLocation } = this.props;
    this.goToScreenAfter(lessonLocation);
  }

  goToScreenAfter(screenId) {
    const nextScreen = getNextScreen(screenId);
    this.onGoToScreen(nextScreen);
  }

  findAndGoToScreen() {
    const {
      diagnosticCompleted,
      diagnosticVisited,
      introSeqCompleted,
      lessonLocation
    } = this.props;
    const nextPage = findNextScreen(
      diagnosticCompleted,
      diagnosticVisited,
      introSeqCompleted,
      lessonLocation
    );
    this.onGoToScreen(nextPage);
  }

  goToSplashScreen() {
    this.onGoToScreen(splashPath);
  }

  render() {
    return null;
  }
}

GoToScreen.propTypes = {
  commit: PropTypes.func.isRequired,
  diagnosticCompleted: PropTypes.bool.isRequired,
  diagnosticVisited: PropTypes.bool,
  introSeqCompleted: PropTypes.bool,
  lessonLocation: PropTypes.string.isRequired,
  prepareSuspendData: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  resetDiagnostic: PropTypes.func,
  setLessonLocation: PropTypes.func.isRequired,
  setPlayAudio: PropTypes.func.isRequired
};

GoToScreen.defaultProps = {
  diagnosticVisited: false,
  introSeqCompleted: false,
  resetDiagnostic: () => {}
};

export const mapStateToProps = state => ({
  diagnosticCompleted: state.diagnosticData.completed,
  diagnosticVisited: state.diagnosticData.visited,
  introSeqCompleted: state.genericData.introSeqCompleted,
  lessonLocation: state.scormData.lessonLocation,
  screen: state.genericData.screen
});

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export const newScreenConnect = (connectedComponent, componentStateProps = () => ({})) => (
  connect(
    state => ({
      ...mapStateToProps(state),
      ...componentStateProps(state)
    }),
    mapDispatchToProps
  )(connectedComponent)
);
