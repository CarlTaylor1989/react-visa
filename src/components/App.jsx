import React, { Component } from 'react';
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Translate } from 'react-redux-i18n';
import { bindActionCreators } from 'redux';
import ActionCreators from '../actions/index';
import { exitLrs } from '../tracking/xapi/XApiAdapter';
import {
  closeWindow,
  displayLoader,
  hideLoader,
  getUnloadEventName,
  getScreenSize
} from '../lib/app';
import {
  indexPath,
  splashPath,
  diagnosticPath,
  introSequencePath,
  gamePath
} from '../config/navigation';
import LoadingNav from './loadingnav/LoadingNav';
import Splash from './splash/Splash';
import Diagnostic from './diagnostic/Diagnostic';
import IntroSequence from './introsequence/IntroSequence';
import Game from './game/Game';
import ExitGame from './generic/exitgame/ExitGame';

import './App.scss';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayExitPopup: false,
      deviceScale: 1,
      displayExitSequence: false
    };

    this.closeScormAPIConnection = this.closeScormAPIConnection.bind(this);
    this.onCloseExitPopup = this.onCloseExitPopup.bind(this);
    this.onDisplayExitPopup = this.onDisplayExitPopup.bind(this);
    this.onExitGame = this.onExitGame.bind(this);
    this.updateWindowSize = this.updateWindowSize.bind(this);
    this.onHoverBtn = this.onHoverBtn.bind(this);
  }

  componentDidMount() {
    const { initialiseScorm } = this.props;
    initialiseScorm();
    window.addEventListener(getUnloadEventName(), this.closeScormAPIConnection);
    window.addEventListener('resize', this.updateWindowSize);

    try {
      // Attempt to monitor for device pixel scale changes.
      const mqString = `(resolution: ${window.devicePixelRatio}dppx)`;
      matchMedia(mqString).addEventListener('change', this.updateWindowSize);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('It was not possible to monitor for device scale changes.');
    }

    this.updateWindowSize();

    if (process.env.PLATFORM === 'local') {
      hideLoader();
    }
  }

  componentWillUnmount() {
    this.closeScormAPIConnection();
    window.removeEventListener(getUnloadEventName(), this.closeScormAPIConnection);
  }

  onCloseExitPopup() {
    this.setState({ displayExitPopup: false });
  }

  onDisplayExitPopup() {
    this.setState({ displayExitPopup: true });
  }

  onExitGame() {
    this.closeScormAPIConnection();
    this.setState({ displayExitSequence: true });
    displayLoader();
    setTimeout(() => {
      closeWindow();
    }, 1000);
  }

  onHoverBtn() {
    const { setPlayAudio } = this.props;
    setPlayAudio('au6');
  }

  updateWindowSize() {
    try {
      const screenSize = getScreenSize();
      let deviceScale = 1;
      if (screenSize.width < 1706) {
        deviceScale = screenSize.width / 1706;
      } else if (screenSize.height < 960) {
        deviceScale = screenSize.height / 960;
      }
      this.setState({ deviceScale });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Device does not support scaling');
    }
  }

  closeScormAPIConnection() {
    const { prepareSuspendData, terminateScorm } = this.props;
    exitLrs();
    prepareSuspendData();
    terminateScorm();
  }

  render() {
    const { displayExitPopup, deviceScale, displayExitSequence } = this.state;
    if (displayExitSequence) {
      return null;
    }
    return (
      <div
        id="app"
        className="app"
        style={{
          transform: `scale(${deviceScale})`
        }}
      >
        <audio id="gameAudioPlayer" />
        <button
          type="button"
          className="exitBtn"
          onClick={this.onDisplayExitPopup}
          onMouseEnter={this.onHoverBtn}
          onTouchEnd={this.onHoverBtn}
        >
          <Translate className="text" value="generic.gameExit" />
          <span className="icon" />
        </button>
        <Switch>
          <Route
            exact
            path={indexPath}
            component={LoadingNav}
          />
          <Route path={splashPath} component={Splash} />
          <Route path={diagnosticPath} component={Diagnostic} />
          <Route path={introSequencePath} component={IntroSequence} />
          <Route path={gamePath} component={Game} />
          <Redirect to={indexPath} />
        </Switch>
        <ExitGame
          showPopup={displayExitPopup}
          closePopup={this.onCloseExitPopup}
          exitGame={this.onExitGame}
        />
      </div>
    );
  }
}

App.propTypes = {
  initialiseScorm: PropTypes.func.isRequired,
  prepareSuspendData: PropTypes.func.isRequired,
  setPlayAudio: PropTypes.func.isRequired,
  terminateScorm: PropTypes.func.isRequired
};

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  null,
  mapDispatchToProps
)(withRouter(App));
