import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import { getChallengeStatus } from '../../../lib/map';

import './ChallengeButton.scss';

class ChallengeButton extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { btnIndex, onChangeChallenge } = this.props;
    onChangeChallenge(btnIndex);
  }

  render() {
    const {
      btnIndex,
      familyId,
      selectedIndex,
      status
    } = this.props;

    const challengeStatus = getChallengeStatus(status);
    const extraClassName = btnIndex === selectedIndex
      ? `${challengeStatus.className} current` : challengeStatus.className;

    return (
      <button
        type="button"
        className={`challengeBtn ${extraClassName}`}
        disabled={challengeStatus.disabled}
        onClick={this.onClick}
      >
        <Translate
          className="text"
          count={btnIndex + 1}
          value="network.productpages.generic.challengeBtn"
        />
        <span className={`icon ${familyId}`} />
      </button>
    );
  }
}

ChallengeButton.propTypes = {
  btnIndex: PropTypes.number.isRequired,
  familyId: PropTypes.string.isRequired,
  onChangeChallenge: PropTypes.func.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  status: PropTypes.number.isRequired
};

export default ChallengeButton;
