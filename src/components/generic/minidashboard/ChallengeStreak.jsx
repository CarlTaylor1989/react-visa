import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Translate } from 'react-redux-i18n';

import './ChallengeStreak.scss';

export class ChallengeStreak extends React.Component {
  constructor(props) {
    super(props);
    this.streakItem = this.streakItem.bind(this);
  }

  streakItem(value) {
    const { progress } = this.props;
    return (
      <div key={value} className={`streakCircle ${progress >= value ? 'filled' : ''}`} />
    );
  }

  buildStreak() {
    return _.range(1, 5).map(this.streakItem);
  }

  render() {
    return (
      <div className="challengeStreak">
        <Translate value="generic.miniDashboard.bonusStreak" />
        <div className="streakContainer">
          {this.buildStreak()}
          <Translate className="bonus" value="generic.miniDashboard.bonus" />
        </div>
      </div>
    );
  }
}

ChallengeStreak.propTypes = {
  progress: PropTypes.number.isRequired
};

export const mapStateToProps = state => ({
  progress: state.streakData.progress
});

export default connect(
  mapStateToProps
)(ChallengeStreak);
