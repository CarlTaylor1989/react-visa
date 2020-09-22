import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import ActionCreators from '../../../actions/index';
import modalSettings from '../../../config/modalsettings';

import './ExitGame.scss';

export class ExitGame extends Component {
  constructor(props) {
    super(props);
    this.onPopupExit = this.onPopupExit.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { setHintsPaused, showPopup } = this.props;

    if (!prevProps.showPopup && showPopup) {
      setHintsPaused(true);
    }
  }

  onPopupExit() {
    const { setHintsPaused } = this.props;
    setHintsPaused(false);
  }

  render() {
    const {
      closePopup,
      exitGame,
      showPopup
    } = this.props;

    return (
      <Modal
        open={showPopup}
        classNames={{
          modal: 'exitGamePopup',
          overlay: 'exitGamePopupOverlay'
        }}
        container={document.getElementById('app')}
        onClose={closePopup}
        onExited={this.onPopupExit}
        {...modalSettings}
      >
        <span className="bgIcons starsLeft" />
        <span className="bgIcons starsRight" />
        <span className="bgIcons bars" />
        <span className="bgIcons loaders" />
        <div className="popupWrapper">
          <div className="popupTitle">
            <Translate value="generic.exitGame.popupTitle" />
          </div>
          <div className="popupText">
            <Translate value="generic.exitGame.popupText" />
          </div>
          <div className="buttons">
            <button
              type="button"
              className="yesBtn"
              onClick={exitGame}
            >
              <Translate className="text" value="generic.exitGame.yesBtn" />
            </button>
            <button
              type="button"
              className="noBtn"
              onClick={closePopup}
            >
              <Translate className="text" value="generic.exitGame.noBtn" />
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

ExitGame.propTypes = {
  closePopup: PropTypes.func.isRequired,
  exitGame: PropTypes.func.isRequired,
  showPopup: PropTypes.bool.isRequired,
  setHintsPaused: PropTypes.func.isRequired
};

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  null,
  mapDispatchToProps
)(ExitGame);
