
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { Translate } from 'react-redux-i18n';
import { BONUS_STREAK_COMPLETED } from '../../../config/scores';

import './BonusStreakPrompt.scss';

class BonusStreakPrompt extends Component {
  componentDidMount() {
    const { setPlayAudio } = this.props;
    setPlayAudio('au7');
  }

  render() {
    return (
      <div className="bonusStreakPrompt">
        <Translate
          className="popupTitle"
          dangerousHTML
          value="generic.prompts.bonusStreakTitle"
        />
        <div className="streak">
          <span className="circle" />
          <span className="line" />
          <span className="circle" />
          <span className="line" />
          <span className="circle" />
          <span className="line" />
          <span className="circle" />
        </div>
        <div className="score">
          <Translate value="generic.prompts.pointsPrefix" />
          <NumberFormat
            value={BONUS_STREAK_COMPLETED}
            displayType="text"
            thousandSeparator=","
          />
        </div>
        <Translate
          className="bonusStreakBody"
          dangerousHTML
          value="generic.prompts.bonusStreakBody"
        />
      </div>
    );
  }
}

BonusStreakPrompt.propTypes = {
  setPlayAudio: PropTypes.func.isRequired
};

export default BonusStreakPrompt;
