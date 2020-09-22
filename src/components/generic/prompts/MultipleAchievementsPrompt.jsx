import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import AchievementPrompt from './AchievementPrompt';

import './MultipleAchievementsPrompt.scss';

const MultipleAchievements = ({ prompts, setPlayAudio }) => (
  <div className="multipleAchievementsPrompt">
    <Translate
      className="popupTitle multipleAchievementsTitle"
      value="generic.prompts.multipleAchievementsTitle"
    />
    <div className="multipleAchievements">
      {prompts.map(prompt => (
        <AchievementPrompt
          multipleAchievements
          achievementId={prompt.id}
          setPlayAudio={setPlayAudio}
          key={prompt.id}
        />
      ))}
    </div>
  </div>
);

MultipleAchievements.propTypes = {
  prompts: PropTypes.array.isRequired,
  setPlayAudio: PropTypes.func.isRequired,
};


export default MultipleAchievements;
