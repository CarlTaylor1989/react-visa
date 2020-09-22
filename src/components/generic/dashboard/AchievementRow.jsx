import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { Translate } from 'react-redux-i18n';
import CompletionBar from '../completionbar/CompletionBar';
import Tooltip from '../tooltip/Tooltip';

import './AchievementRow.scss';

const AchievementRow = (props) => {
  const {
    achievementId,
    complete,
    completion,
    hidden,
    score
  } = props;

  return (
    <div className="achievementRow">
      <div className={`achievementRowIdentifier ${complete ? 'complete' : ''}`}>
        <div className={`achievementRowIcon ${achievementId} ${complete ? 'dark' : ''}`} />
        <div className="achievementRowInformation">
          <Tooltip fieldName="generic.tooltips.dashboard.achievements.title">
            <div className="achievementRowName">
              <Translate value={`generic.achievements.${achievementId}.title`} />
            </div>
          </Tooltip>
          {!complete && hidden ? (
            <Tooltip fieldName="generic.tooltips.dashboard.achievements.hidden">
              <div className="achievementRowDescription">
                <Translate value="generic.dashboard.hidden" />
              </div>
            </Tooltip>
          ) : (
            <Tooltip fieldName="generic.tooltips.dashboard.achievements.description">
              <div className="achievementRowDescription">
                <Translate value={`generic.achievements.${achievementId}.description`} />
              </div>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="achievementRowProgress">
        <Tooltip fieldName="generic.tooltips.dashboard.achievements.progress">
          <div className="achievementRowCompletion">
            <CompletionBar
              {...completion}
              displayValue={!(!complete && hidden)}
              hiddenTextField="generic.dashboard.hiddenValue"
            />
          </div>
        </Tooltip>
        <Tooltip fieldName="generic.tooltips.dashboard.achievements.points">
          <div className={`achievementRowScore ${complete ? 'complete' : ''}`}>
            <Translate value="generic.dashboard.achievementPlus" />
            <NumberFormat
              value={score}
              displayType="text"
              thousandSeparator=","
            />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

AchievementRow.propTypes = {
  achievementId: PropTypes.string.isRequired,
  complete: PropTypes.bool.isRequired,
  completion: PropTypes.object.isRequired,
  hidden: PropTypes.bool.isRequired,
  score: PropTypes.number.isRequired
};

export default AchievementRow;
