import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { I18n, Translate } from 'react-redux-i18n';
import ActionCreators from '../../../actions/index';
import SettingRow from './settings/SettingRow';
import modalSettings from '../../../config/modalsettings';
import { sendInteractionData } from '../../../tracking/xapi/XApiAdapter';

import './SettingsPopup.scss';

export class SettingsPopup extends Component {
  constructor(props) {
    super(props);
    this.timeAvailable = null;
    this.onPopupExit = this.onPopupExit.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {
      setHintsPaused,
      showPopup
    } = this.props;

    if (!prevProps.showPopup && showPopup) {
      setHintsPaused(true);
      this.timeAvailable = new Date();
    }
  }

  onPopupExit() {
    const {
      exitPopup,
      setHintsPaused,
    } = this.props;
    exitPopup();
    setHintsPaused(false);
    this.sendPopupTrackingData();
  }

  onRegionChange() {
    const { changeRegion } = this.props;
    changeRegion();
    this.sendPopupTrackingData();
  }

  sendPopupTrackingData() {
    const { popupReferrer } = this.props;
    sendInteractionData({
      type: 'experienced',
      activity: {
        id: 'settings',
        type: 'slide',
        title: I18n.t('xapi.settings.title'),
        description: I18n.t('xapi.settings.description')
      },
      response: {
        timeAvailable: this.timeAvailable,
        timeResponse: new Date()
      },
      parent: '',
      referrer: popupReferrer
    });
  }

  render() {
    const {
      audio,
      closePopup,
      region,
      showPopup,
      toggleAudio,
      toggleTooltips,
      tooltips
    } = this.props;

    const regionText = region ? I18n.t(`diagnostic.regions.${region}.code`) : '';

    return (
      <Modal
        open={showPopup}
        classNames={{
          modal: 'settingsPopup',
          overlay: 'settingsPopupOverlay'
        }}
        container={document.getElementById('app')}
        onClose={closePopup}
        onExited={this.onPopupExit}
        {...modalSettings}
      >
        <button
          type="button"
          className="exitPopup"
          onClick={closePopup}
        >
          <Translate value="generic.popupCloseBtn" />
        </button>
        <div className="popupWrapper">
          <div className="popupTitle">
            <Translate value="generic.settings.popupTitle" />
          </div>
          <div className="settings">
            <SettingRow
              name="audio"
              handleChange={toggleAudio}
              hasToggle
              checked={audio}
            />
            <SettingRow
              name="region"
              buttonLabel="change"
              handleClick={this.onRegionChange}
              hasButton
              extraText={regionText}
            />
            <SettingRow
              name="tooltips"
              checked={tooltips}
              handleChange={toggleTooltips}
              hasToggle
            />
          </div>
        </div>
      </Modal>
    );
  }
}

SettingsPopup.propTypes = {
  audio: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
  changeRegion: PropTypes.func.isRequired,
  exitPopup: PropTypes.func.isRequired,
  popupReferrer: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  showPopup: PropTypes.bool.isRequired,
  toggleAudio: PropTypes.func.isRequired,
  toggleTooltips: PropTypes.func.isRequired,
  tooltips: PropTypes.bool.isRequired,
  setHintsPaused: PropTypes.func.isRequired
};

export const mapStateToProps = state => ({
  audio: state.settingsData.audio,
  popupReferrer: state.genericData.popupReferrer,
  region: state.diagnosticData.region,
  tooltips: state.settingsData.tooltips,
});

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPopup);
