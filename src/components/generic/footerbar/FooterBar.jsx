import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Translate } from 'react-redux-i18n';
import ActionCreators from '../../../actions/index';
import SettingsPopup from './SettingsPopup';
import Hints from '../hints/Hints';

import './FooterBar.scss';

export class FooterBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySettings: false
    };

    this.onCloseSettings = this.onCloseSettings.bind(this);
    this.onDisplaySettings = this.onDisplaySettings.bind(this);
    this.onChangeRegion = this.onChangeRegion.bind(this);
    this.onHoverBtn = this.onHoverBtn.bind(this);
  }

  onCloseSettings() {
    this.setState({ displaySettings: false });
  }

  onDisplaySettings() {
    this.setState({ displaySettings: true });
  }

  onChangeRegion() {
    const { changeRegion, updateSettingsAchievements } = this.props;
    this.onCloseSettings();
    changeRegion();
    updateSettingsAchievements();
  }

  onHoverBtn() {
    const { setPlayAudio } = this.props;
    setPlayAudio('au6');
  }

  render() {
    const { settingsBtnEnabled, updateSettingsAchievements } = this.props;
    const { displaySettings } = this.state;

    return (
      <div className="footerBar">
        <Hints />
        <button
          type="button"
          className={`settingsBtn ${!settingsBtnEnabled ? 'disabled' : ''}`}
          onClick={this.onDisplaySettings}
          onMouseEnter={this.onHoverBtn}
          onTouchEnd={this.onHoverBtn}
          disabled={!settingsBtnEnabled}
        >
          <span className="icon" />
          <Translate value="generic.settingsBtn" />
        </button>
        <SettingsPopup
          showPopup={displaySettings}
          closePopup={this.onCloseSettings}
          exitPopup={updateSettingsAchievements}
          changeRegion={this.onChangeRegion}
        />
      </div>
    );
  }
}

FooterBar.propTypes = {
  changeRegion: PropTypes.func.isRequired,
  updateSettingsAchievements: PropTypes.func.isRequired,
  setPlayAudio: PropTypes.func.isRequired,
  settingsBtnEnabled: PropTypes.bool.isRequired
};

export const mapStateToProps = state => ({
  settingsBtnEnabled: state.genericData.settingsBtnEnabled
});

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FooterBar);
