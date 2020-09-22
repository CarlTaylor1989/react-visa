import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';

import './Achievements.scss';

export const Achievements = (props) => {
  const { lastCompleted } = props;
  return (
    <div className="achievement">
      <Translate value="generic.miniDashboard.achievements" />
      {lastCompleted ? (
        <div className="achievementContainer">
          <span className={`icon dark ${lastCompleted}`} />
          <Translate value={`generic.achievements.${lastCompleted}.title`} />
        </div>
      ) : (
        <div className="achievementContainer">
          <Translate value="generic.miniDashboard.noAchievements" />
        </div>
      )}
    </div>
  );
};

Achievements.propTypes = {
  lastCompleted: PropTypes.string.isRequired
};

export const mapStateToProps = state => ({
  lastCompleted: state.achievementsData.lastCompleted
});

export default connect(
  mapStateToProps
)(Achievements);
