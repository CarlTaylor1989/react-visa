
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import Rank from '../minidashboard/Rank';

import './RankPrompt.scss';

class RankPrompt extends Component {
  componentDidMount() {
    this.playAudio();
  }

  componentDidUpdate(prevProps) {
    const { rankId } = this.props;
    if (rankId && prevProps.rankId !== rankId) {
      this.playAudio();
    }
  }

  playAudio() {
    const { setPlayAudio } = this.props;
    setPlayAudio('au3');
  }

  render() {
    return (
      <div className="rankPrompt">
        <Translate className="popupTitle" value="generic.prompts.rankTitle" />
        <Rank displayThreshold />
      </div>
    );
  }
}

RankPrompt.propTypes = {
  rankId: PropTypes.string.isRequired,
  setPlayAudio: PropTypes.func.isRequired
};

export default RankPrompt;
