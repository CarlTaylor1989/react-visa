import React from 'react';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import modalSettings from '../../../../../config/modalsettings';

import './ShowSolutionPrompt.scss';

const ShowSolutionPrompt = ({ showPrompt, closePrompt, onGiveUp }) => (
  <Modal
    open={showPrompt}
    classNames={{
      modal: 'showSolutionPrompt',
      overlay: 'showSolutionOverlay'
    }}
    onClose={closePrompt}
    container={document.getElementById('app')}
    {...modalSettings}
  >
    <div className="popupWrapper">
      <Translate className="popupTitle" value="clientprops.showTheSolutionPopupQuestion" />
      <Translate className="popupText" value="clientprops.showTheSolutionPopupText" />
      <button
        type="button"
        className="ctaBtn"
        onClick={onGiveUp}
      >
        <Translate value="clientprops.yesBtn" />
      </button>
      <button
        type="button"
        className="ctaBtn"
        onClick={closePrompt}
      >
        <Translate value="clientprops.noBtn" />
      </button>
    </div>
  </Modal>
);

ShowSolutionPrompt.propTypes = {
  showPrompt: PropTypes.bool.isRequired,
  closePrompt: PropTypes.func.isRequired,
  onGiveUp: PropTypes.func.isRequired
};

export default ShowSolutionPrompt;
