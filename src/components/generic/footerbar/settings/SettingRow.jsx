import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n, Translate } from 'react-redux-i18n';
import Toggle from '../../toggle/Toggle';
import Tooltip from '../../tooltip/Tooltip';
import settingIds from '../../../../config/settings';
import { sendInteractionData } from '../../../../tracking/xapi/XApiAdapter';

import './SettingRow.scss';

class SettingRow extends Component {
  constructor(props) {
    super(props);

    this.onToggleChange = this.onToggleChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onToggleChange(value) {
    const { handleChange, name } = this.props;
    sendInteractionData({
      type: 'interacted',
      activity: {
        id: `settings/${settingIds[name]}`,
        type: 'interaction',
        title: I18n.t(`xapi.settings.${name}Title`),
        description: I18n.t(`xapi.settings.${name}Description`)
      },
      response: {
        detail: value ? I18n.t('xapi.settings.on') : I18n.t('xapi.settings.off')
      },
      parent: ''
    });
    handleChange(value);
  }

  onButtonClick() {
    const { handleClick, name } = this.props;
    const btnName = `${name}Btn`;
    sendInteractionData({
      type: 'interacted',
      activity: {
        id: `settings/${settingIds[btnName]}`,
        type: 'interaction',
        title: I18n.t(`xapi.settings.${name}BtnTitle`),
        description: I18n.t(`xapi.settings.${name}BtnDescription`)
      },
      parent: ''
    });
    handleClick();
  }

  render() {
    const {
      buttonLabel,
      checked,
      extraText,
      hasButton,
      hasToggle,
      name
    } = this.props;
    const toggle = hasToggle
      ? (
        <Tooltip fieldName={`generic.tooltips.settings.${name}`}>
          <span>
            <Toggle
              handleChange={this.onToggleChange}
              checked={checked}
            />
          </span>
        </Tooltip>
      ) : null;

    const click = hasButton
      ? (
        <Tooltip fieldName={`generic.tooltips.settings.${name}Btn`}>
          <button
            type="button"
            className="settingBtn"
            onClick={this.onButtonClick}
          >
            <Translate className="settingName" value={`generic.settings.${buttonLabel}`} />
          </button>
        </Tooltip>
      ) : null;

    return (
      <div className={`settingsRow ${name}`}>
        <span className="icon" />
        <div className="settingName">
          <Translate value={`generic.settings.${name}`} />
          {extraText}
        </div>
        <div className="control">
          {toggle}
          {click}
        </div>
      </div>
    );
  }
}

SettingRow.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  extraText: PropTypes.string,
  handleChange: PropTypes.func,
  hasToggle: PropTypes.bool,
  buttonLabel: PropTypes.string,
  handleClick: PropTypes.func,
  hasButton: PropTypes.bool
};

SettingRow.defaultProps = {
  buttonLabel: '',
  checked: false,
  extraText: '',
  handleChange: null,
  handleClick: null,
  hasButton: false,
  hasToggle: false
};

export default SettingRow;
