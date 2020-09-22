import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import {
  CHALLENGE_PERFECT_STATUS,
  CHALLENGE_COMPLETION_STATUS,
  CHALLENGE_UNAVAILABLE_STATUS,
  CHALLENGE_NOT_STARTED_CLASS,
  CHALLENGE_AVAILABLE_CLASS,
  CHALLENGE_COMPLETED_CLASS,
  CHALLENGE_PERFECT_CLASS
} from '../../../../config/constants';
import * as scores from '../../../../config/scores';

import './ChallengeIconContent.scss';

export class ChallengeIconContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      challengePoints: scores.CHALLENGE_NOT_STARTED,
      status: CHALLENGE_NOT_STARTED_CLASS
    };
  }

  componentDidMount() {
    this.updateChallengeState();
  }

  componentDidUpdate(prevProps) {
    const { lastChallengesModified, challengeId, mapInitialised } = this.props;
    if ((prevProps.lastChallengesModified !== lastChallengesModified
      && lastChallengesModified.includes(challengeId))
      || (!prevProps.mapInitialised && mapInitialised)) {
      this.updateChallengeState();
    }
  }

  updateChallengeState() {
    const {
      challengeId,
      familyId,
      challenges
    } = this.props;
    const { status } = this.state;
    const found = challenges.find(challenge => challenge.familyId === familyId
      && challenge.id === challengeId);

    let newStatus = CHALLENGE_NOT_STARTED_CLASS;
    let challengePoints = scores.CHALLENGE_NOT_STARTED;

    if (found && found.status > CHALLENGE_UNAVAILABLE_STATUS) {
      switch (found.status) {
        case CHALLENGE_PERFECT_STATUS:
          newStatus = CHALLENGE_PERFECT_CLASS;
          challengePoints = scores.CHALLENGE_COMPLETED_PERFECT;
          break;
        case CHALLENGE_COMPLETION_STATUS:
          newStatus = CHALLENGE_COMPLETED_CLASS;
          challengePoints = scores.CHALLENGE_COMPLETED;
          break;
        default:
          newStatus = CHALLENGE_AVAILABLE_CLASS;
      }
    } else if (found && found.isFirst) {
      newStatus = CHALLENGE_AVAILABLE_CLASS;
    }

    if (newStatus !== status) {
      this.setState({
        status: newStatus,
        challengePoints
      });
    }
  }

  render() {
    const {
      coordinates,
      familyId,
      type
    } = this.props;
    const { challengePoints, status } = this.state;

    const styles = {
      left: coordinates[0],
      top: coordinates[1]
    };

    return (
      <div className={`challengeIconContent ${type}`} style={styles}>
        <Translate
          className="statusText"
          value={`network.productpages.generic.${status}`}
        />
        <span className={`challengeIcon ${familyId} ${status}`} />
        <div className="pointsContainer">
          <div className="pointsText">
            <Translate value="network.productpages.generic.points" />
          </div>
          <NumberFormat
            className="challengePoints"
            value={challengePoints}
            displayType="text"
            thousandSeparator=","
          />
        </div>
      </div>
    );
  }
}

ChallengeIconContent.propTypes = {
  challenges: PropTypes.array.isRequired,
  challengeId: PropTypes.string.isRequired,
  coordinates: PropTypes.array.isRequired,
  familyId: PropTypes.string.isRequired,
  lastChallengesModified: PropTypes.array.isRequired,
  mapInitialised: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired
};

export const mapStateToProps = state => ({
  challenges: state.mapData.challenges,
  lastChallengesModified: state.mapData.lastChallengesModified,
  mapInitialised: state.mapData.initialised
});

export default connect(
  mapStateToProps
)(ChallengeIconContent);
