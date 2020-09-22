import React from 'react';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import modalSettings from '../../../config/modalsettings';
import './ResetStreakPopup.scss';

export default class ResetStreakPopup extends React.Component {
  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.onYes = this.onYes.bind(this);
  }

  onClose() {
    const { onCloseResetStreakPopup } = this.props;
    onCloseResetStreakPopup(false);
  }

  onYes() {
    const { onCloseResetStreakPopup } = this.props;
    onCloseResetStreakPopup(true);
  }

  render() {
    const { displayResetStreak } = this.props;
    return (
      <Modal
        open={displayResetStreak}
        classNames={{
          modal: 'resetStreakPopup',
          overlay: 'resetStreakPopupOverlay'
        }}
        onClose={this.onClose}
        {...modalSettings}
      >
        <div className="popupWrapper">
          <div className="title">
            <Translate value="network.productpages.generic.warning" />
          </div>
          <div className="description">
            <Translate value="network.productpages.generic.warningDescription" />
          </div>
          <button
            type="button"
            className="yesBtn"
            onClick={this.onYes}
          >
            <Translate value="network.productpages.generic.yesBtn" />
          </button>
          <button
            type="button"
            className="noBtn"
            onClick={this.onClose}
          >
            <Translate value="network.productpages.generic.noBtn" />
          </button>
        </div>
      </Modal>
    );
  }
}

ResetStreakPopup.propTypes = {
  displayResetStreak: PropTypes.bool.isRequired,
  onCloseResetStreakPopup: PropTypes.func.isRequired
};
