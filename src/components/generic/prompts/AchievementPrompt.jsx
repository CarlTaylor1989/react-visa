import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { Translate } from 'react-redux-i18n';
import achievements from '../../../config/achievements';

import './AchievementPrompt.scss';

class AchievementPrompt extends Component {
  componentDidMount() {
    this.playAudio();
  }

  componentDidUpdate(prevProps) {
    const { achievementId } = this.props;
    if (achievementId && prevProps.achievementId !== achievementId) {
      this.playAudio();
    }
  }

  playAudio() {
    const { setPlayAudio } = this.props;
    setPlayAudio('au2');
  }

  render() {
    const { achievementId, multipleAchievements } = this.props;
    const achievement = achievements.find(ac => ac.id === achievementId);
    const score = achievement ? achievement.score : 0;

    return (
      <div className="achievementPrompt">
        {!multipleAchievements && (
          <Translate
            className="popupTitle"
            value="generic.prompts.achievementTitle"
          />
        )}
        <span className={`achievementIcon dark ${achievementId}`} />
        {multipleAchievements ? (
          <span className="achievementText">
            <Translate
              className="achievementTitle"
              value={`generic.achievements.${achievementId}.title`}
            />
            <Translate
              className="achievementDescription"
              value={`generic.achievements.${achievementId}.description`}
            />
            <div className="score">
              <Translate value="generic.prompts.pointsPrefix" />
              <NumberFormat
                value={score}
                displayType="text"
                thousandSeparator=","
              />
            </div>
          </span>
        ) : (
          <>
            <Translate
              className="achievementTitle"
              value={`generic.achievements.${achievementId}.title`}
            />
            <Translate
              className="achievementDescription"
              value={`generic.achievements.${achievementId}.description`}
            />
            <div className="score">
              <Translate value="generic.prompts.pointsPrefix" />
              <NumberFormat
                value={score}
                displayType="text"
                thousandSeparator=","
              />
            </div>
          </>
        )}
      </div>
    );
  }
}

AchievementPrompt.defaultProps = {
  multipleAchievements: false
};

AchievementPrompt.propTypes = {
  achievementId: PropTypes.string.isRequired,
  multipleAchievements: PropTypes.bool,
  setPlayAudio: PropTypes.func.isRequired
};

export default AchievementPrompt;
