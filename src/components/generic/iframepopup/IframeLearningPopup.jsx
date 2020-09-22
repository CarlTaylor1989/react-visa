import React from 'react';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import IframePopup from './IframePopup';
import IframePopupFailed from './IframePopupFailed';
import modalSettings from '../../../config/modalsettings';
import { getDeeplinkURL } from '../../../lib/deeplinks';

const testingLearninglink = require('../../../resources/learning.html');

class IframeLearningPopup extends IframePopup {
  componentDidUpdate(prevProps) {
    const { gomoId, showPopup } = this.props;

    if (!prevProps.showPopup && showPopup) {
      this.setIframeSrc();
      this.onGomoCourseOpened(gomoId);
    }
  }

  setIframeSrc() {
    const { iframeSrc } = this.props;
    if (process.env.PLATFORM === 'production') {
      this.displayIframePopupLoader();
      getDeeplinkURL(iframeSrc, {
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
        iframeSrc: testingLearninglink,
        showLoader: false
      });
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
          modal: 'iframePopup',
          overlay: 'iframePopupOverlay'
        }}
        container={document.getElementById('app')}
        onClose={this.onExitSco}
        onExited={onExited}
        onEntered={onModalOpen}
        {...modalSettings}
      >
        <div
          className={`iframePopupLoad learning ${showLoader ? '' : 'hidden'}`}
        />
        {displayError && <IframePopupFailed />}
        <button
          type="button"
          className="exitPopup"
          onClick={this.onExitSco}
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
      </Modal>
    );
  }
}

IframeLearningPopup.propTypes = {
  gomoId: PropTypes.string.isRequired,
  iframeSrc: PropTypes.string.isRequired,
  onExited: PropTypes.func.isRequired,
  showPopup: PropTypes.bool.isRequired
};

export default IframeLearningPopup;
