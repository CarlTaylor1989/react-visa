import React from 'react';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import IframePopup from './IframePopup';
import ChallengeNavigator from './ChallengeNavigator';
import IframePopupFailed from './IframePopupFailed';
import { getDeeplinkURL } from '../../../lib/deeplinks';
import modalSettings from '../../../config/modalsettings';

import './IframeChallengesPopup.scss';

const testingChallengelink = require('../../../resources/challenge.html');

class IframeChallengesPopup extends IframePopup {
  constructor(props) {
    super(props);

    this.challengeNavigator = null;
    this.setIframeSrc = this.setIframeSrc.bind(this);

    this.setChallengeNavigatorRef = (element) => {
      this.challengeNavigator = element;
    };
    this.onExitPopup = this.onExitPopup.bind(this);
  }

  updateChallengeData(status, score) {
    if (this.challengeNavigator) {
      this.challengeNavigator.updateChallengeData(status, score);
    }
  }

  setIframeSrc(src) {
    if (process.env.PLATFORM === 'production') {
      getDeeplinkURL(src, {
        success: (url) => {
          this.setState({
            dummySco: false,
            iframeSrc: url
          });
        },
        error: () => {
          this.setState({
            dummySco: false,
            iframeSrc: 'about:blank',
            displayError: true,
            showLoader: false
          });
        }
      });
    } else {
      this.setState({
        dummySco: true,
        iframeSrc: testingChallengelink,
        showLoader: false
      });
    }
  }

  onExitPopup() {
    if (this.challengeNavigator) {
      if (!this.challengeNavigator.onExitChallenges()) {
        this.onExitSco();
      }
    } else {
      this.onExitSco();
    }
  }

  render() {
    const { onExited, onModalOpen, showPopup } = this.props;
    const {
      dummySco,
      iframeSrc,
      showLoader,
      displayError
    } = this.state;

    return (
      <Modal
        open={showPopup}
        className="iframePopup"
        classNames={{
          modal: 'iframePopup iframeChallengesPopup',
          overlay: 'iframePopupOverlay'
        }}
        container={document.getElementById('app')}
        onClose={this.onExitPopup}
        onExited={onExited}
        onEntered={onModalOpen}
        {...modalSettings}
      >
        <div
          className={`iframePopupLoad challenges ${showLoader ? '' : 'hidden'}`}
        />
        {displayError && <IframePopupFailed />}
        <button
          type="button"
          className="exitPopup"
          onClick={this.onExitPopup}
        >
          <Translate value="generic.popupCloseBtn" />
        </button>
        {iframeSrc && dummySco && (
          <iframe
            id="courseIframe"
            srcDoc={iframeSrc}
            title="SCO"
            ref={this.setIframeRef}
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        )}
        {iframeSrc && !dummySco && (
          <iframe
            id="courseIframe"
            src={iframeSrc}
            title="SCO"
            ref={this.setIframeRef}
            onLoad={this.onIframeLoaded}
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        )}
        <ChallengeNavigator
          ref={this.setChallengeNavigatorRef}
          setIframeSrc={this.setIframeSrc}
          closeChallengesPopupCallback={this.onExitSco}
          onGomoCourseOpened={this.onGomoCourseOpened}
        />
      </Modal>
    );
  }
}

IframeChallengesPopup.propTypes = {
  onExited: PropTypes.func.isRequired,
  showPopup: PropTypes.bool.isRequired
};

export default IframeChallengesPopup;
