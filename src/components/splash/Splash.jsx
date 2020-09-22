import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import { GoToScreen, newScreenConnect } from '../generic/GoToScreen';
import { splashPath } from '../../config/navigation';
import { splashReferrer } from '../../config/referrers';
import AnimatedText from '../generic/animatedtext/AnimatedText';
import splashJson from '../../translations/en_us/splash.json';

import './Splash.scss';

export class Splash extends GoToScreen {
  constructor(props) {
    super(props);

    this.state = {
      isIntroAnimationComplete: false,
      playIntroAnimation: false
    };
  }

  componentDidMount() {
    const { setPopupReferrer } = this.props;
    setPopupReferrer(splashReferrer);
    this.motivationalTexts = splashJson.motivationalTexts;
    this.setState({
      playIntroAnimation: true
    });
  }

  componentWillUnmount() {
    const { setScreenReferrer } = this.props;
    setScreenReferrer(splashReferrer);
    this.setState({
      playIntroAnimation: false
    });
  }

  render() {
    const { diagnosticCompleted, diagnosticVisited, lessonLocation } = this.props;
    const { isIntroAnimationComplete, playIntroAnimation } = this.state;

    return (
      <div className="splash">
        <div className="logo-container">
          <span className="small-logo" />
        </div>
        <div className="splash-content">
          {
            this.motivationalTexts
            && (
              <AnimatedText
                texts={this.motivationalTexts}
                playAnimation={playIntroAnimation}
                handleAnimationEnded={() => this.setState({ isIntroAnimationComplete: true })}
              />
            )
          }
          {(['', '/', splashPath].includes(lessonLocation)
            && !diagnosticCompleted && !diagnosticVisited ? (
              <button
                type="button"
                className={`nextBtn${isIntroAnimationComplete ? '' : ' hide'}`}
                onClick={this.goToNextScreen}
                disabled={!isIntroAnimationComplete}
              >
                <Translate value="splash.startBtn" />
              </button>
            ) : (
              <button
                type="button"
                className={`nextBtn${isIntroAnimationComplete ? '' : ' hide'}`}
                onClick={this.findAndGoToScreen}
                disabled={!isIntroAnimationComplete}
              >
                <Translate value="splash.continueBtn" />
              </button>
            ))}
        </div>
      </div>
    );
  }
}

Splash.propTypes = {
  lessonLocation: PropTypes.string.isRequired,
  setPopupReferrer: PropTypes.func.isRequired,
  setScreenReferrer: PropTypes.func.isRequired,
  suspendData: PropTypes.object.isRequired
};

export const mapStateToProps = state => ({
  suspendData: state.scormData.suspendData
});

export default newScreenConnect(Splash, mapStateToProps);
