import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tooltip from '../../generic/tooltip/Tooltip';
import {
  CHALLENGE_PERFECT_STATUS,
  CHALLENGE_COMPLETION_STATUS,
  CHALLENGE_UNAVAILABLE_STATUS,
  CHALLENGE_AVAILABLE_CLASS,
  CHALLENGE_COMPLETED_CLASS,
  CHALLENGE_PERFECT_CLASS
} from '../../../config/constants';

import './ChallengeIcon.scss';

export class ChallengeIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      tooltipStatus: CHALLENGE_AVAILABLE_CLASS
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

    let newStatus = '';
    if (found && found.status > CHALLENGE_UNAVAILABLE_STATUS) {
      switch (found.status) {
        case CHALLENGE_PERFECT_STATUS:
          newStatus = CHALLENGE_PERFECT_CLASS;
          break;
        case CHALLENGE_COMPLETION_STATUS:
          newStatus = CHALLENGE_COMPLETED_CLASS;
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
        tooltipStatus: newStatus
      });
    }
  }

  render() {
    const {
      coordinates,
      familyId,
      type
    } = this.props;
    const { status, tooltipStatus } = this.state;

    const styles = {
      left: coordinates[0],
      top: coordinates[1]
    };

    return (
      <Tooltip fieldName={`generic.tooltips.productnetwork.${tooltipStatus}`}>
        <span
          style={styles}
          className={`challengeIcon ${familyId} ${status} ${type}`}
        />
      </Tooltip>
    );
  }
}

ChallengeIcon.propTypes = {
  challenges: PropTypes.array.isRequired,
  challengeId: PropTypes.string.isRequired,
  coordinates: PropTypes.array.isRequired,
  familyId: PropTypes.string.isRequired,
  lastChallengesModified: PropTypes.array.isRequired,
  mapInitialised: PropTypes.bool.isRequired,
  type: PropTypes.string
};

ChallengeIcon.defaultProps = {
  type: ''
};

export const mapStateToProps = state => ({
  challenges: state.mapData.challenges,
  lastChallengesModified: state.mapData.lastChallengesModified,
  mapInitialised: state.mapData.initialised
});

export default connect(
  mapStateToProps
)(ChallengeIcon);
