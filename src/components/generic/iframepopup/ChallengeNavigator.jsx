import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { bindActionCreators } from 'redux';
import ChallengeButton from './ChallengeButton';
import ResetStreakPopup from './ResetStreakPopup';
import ActionCreators from '../../../actions/index';
import * as map from '../../../lib/map';
import {
  CHALLENGE_IN_PROGRESS_STATUS,
  CHALLENGE_AVAILABLE_STATUS,
  CHALLENGE_FAILED_STATUS,
  CHALLENGE_COMPLETION_STATUS,
  CHALLENGE_PERFECT_STATUS,
  FAMILY_COMPLETION_STATUS,
  XAPI_CHALLENGE_MIN_SCORE,
  XAPI_CHALLENGE_MAX_SCORE
} from '../../../config/constants';
import * as scores from '../../../config/scores';
import { sendInteractionData } from '../../../tracking/xapi/XApiAdapter';
import challengesData from '../../../translations/en_us/network/maps/map1/challenges/index';

import './ChallengeNavigator.scss';

export class ChallengeNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      challenges: [],
      challengeChildren: [],
      closeChallengesPopup: false,
      isNextUnlocked: false,
      displayResetStreak: false,
      nextIndex: null,
      selectedIndex: 0,
      statuses: {},
      gomoId: ''
    };

    this.timeAvailable = null;

    this.onChangeChallenge = this.onChangeChallenge.bind(this);
    this.onNextChallenge = this.onNextChallenge.bind(this);
    this.onPreviousChallenge = this.onPreviousChallenge.bind(this);
    this.onCloseResetStreakPopup = this.onCloseResetStreakPopup.bind(this);
  }

  componentDidMount() {
    const { onGomoCourseOpened, setIframeSrc } = this.props;

    const challenges = this.getProductChallenges();
    const index = map.getNextChallengeIndex(challenges);
    const challengeData = map.findChallengeInChallenges(challenges[index], challengesData);

    setIframeSrc(challengeData.link);
    onGomoCourseOpened(challengeData.gomoId);
    this.timeAvailable = new Date();

    const statuses = {};
    challenges.forEach((ch) => {
      statuses[ch.id] = ch.status;
    });

    this.setState({
      challenges,
      challengeChildren: challengeData.children,
      isNextUnlocked: (statuses[challenges[index].id] === CHALLENGE_COMPLETION_STATUS
        || statuses[challenges[index].id] === CHALLENGE_PERFECT_STATUS)
        && !challenges[index].isFinal,
      selectedIndex: index,
      statuses,
      gomoId: challengeData.gomoId
    });
  }

  onCloseResetStreakPopup(resetStreak) {
    const {
      closeChallengesPopupCallback,
      resetStreakProgress,
      updateChallengeStatus
    } = this.props;
    const {
      closeChallengesPopup,
      statuses,
      nextIndex,
      selectedIndex,
      challenges
    } = this.state;
    const currentChallenge = challenges[selectedIndex];

    if (resetStreak) {
      const updateStatuses = {
        [currentChallenge.id]: CHALLENGE_FAILED_STATUS
      };
      updateChallengeStatus(
        currentChallenge.id,
        currentChallenge.familyId,
        CHALLENGE_FAILED_STATUS
      );

      this.sendChallengeStatement(CHALLENGE_FAILED_STATUS);

      resetStreakProgress(
        currentChallenge.id,
        currentChallenge.familyId
      );
      if (Number.isInteger(nextIndex)) {
        this.setNextChallenge();
      }
      if (closeChallengesPopup) {
        closeChallengesPopupCallback();
      }

      this.setState({
        closeChallengesPopup: false,
        displayResetStreak: false,
        statuses: {
          ...statuses,
          ...updateStatuses
        }
      });
    } else {
      this.setState({ displayResetStreak: false, nextIndex: null });
    }
  }

  onChangeChallenge(index) {
    const { active, streak } = this.props;
    const { challenges, selectedIndex, statuses } = this.state;
    if (selectedIndex !== index) {
      const inprogress = statuses[challenges[selectedIndex].id];
      if (inprogress === CHALLENGE_IN_PROGRESS_STATUS && active && streak) {
        this.setState({ displayResetStreak: true, nextIndex: index });
      } else {
        this.setNextChallenge(index);
      }
    }
  }

  onExitChallenges() {
    const { active, streak } = this.props;
    const { challenges, selectedIndex, statuses } = this.state;
    const inprogress = statuses[challenges[selectedIndex].id];
    let result = false;
    if (inprogress === CHALLENGE_IN_PROGRESS_STATUS && active && streak) {
      this.setState({
        displayResetStreak: true,
        closeChallengesPopup: true
      });
      result = true;
    }
    return result;
  }

  onNextChallenge() {
    const { selectedIndex } = this.state;
    this.onChangeChallenge(selectedIndex + 1);
  }

  onPreviousChallenge() {
    const { selectedIndex } = this.state;
    this.onChangeChallenge(selectedIndex - 1);
  }

  setNextChallenge(next) {
    const { onGomoCourseOpened, setIframeSrc } = this.props;
    const { challenges, statuses, nextIndex } = this.state;
    const index = Number.isInteger(nextIndex) ? nextIndex : next;
    const challengeData = map.findChallengeInChallenges(challenges[index], challengesData);

    setIframeSrc(challengeData.link);
    onGomoCourseOpened(challengeData.gomoId);
    this.timeAvailable = new Date();

    this.setState({
      challengeChildren: challengeData.children,
      nextIndex: null,
      selectedIndex: index,
      isNextUnlocked: ((statuses[challenges[index].id] === CHALLENGE_COMPLETION_STATUS
        || statuses[challenges[index].id] === CHALLENGE_PERFECT_STATUS))
        && !challenges[index].isFinal,
      gomoId: challengeData.gomoId
    });
  }

  getProductChallenges() {
    const {
      challenges,
      currentFamily,
      currentProduct
    } = this.props;

    return challenges.filter(ch => (
      ch.productId === currentProduct && ch.familyId === currentFamily
    ));
  }

  setChallengeSore(canUpdateStatuses, challengeStatus, challengeId, isFinal) {
    const {
      increaseChallengesCompleted,
      increasePerfectBonus,
      increaseScore
    } = this.props;
    const { statuses } = this.state;

    if (canUpdateStatuses) {
      let challengeScore = 0;
      if (challengeStatus === CHALLENGE_COMPLETION_STATUS
        || (challengeStatus === CHALLENGE_PERFECT_STATUS
          && statuses[challengeId] !== CHALLENGE_COMPLETION_STATUS)) {
        challengeScore = scores.CHALLENGE_COMPLETED;
        increaseChallengesCompleted();
      }

      if (challengeStatus === CHALLENGE_PERFECT_STATUS) {
        challengeScore += scores.PERFECT_CHALLENGE;
        increasePerfectBonus();
      }

      if (isFinal && challengeStatus >= CHALLENGE_COMPLETION_STATUS
        && statuses[challengeId] !== CHALLENGE_COMPLETION_STATUS) {
        challengeScore += scores.PRODUCT_COMPLETED;
      }

      increaseScore(challengeScore);
    }
  }

  updateChallengeData(status, score) {
    const {
      increaseProductsCompleted,
      increaseStreak,
      resetStreakProgress,
      setLastChallengesModified,
      setLastProductCompleted,
      updateChallengeStatus
    } = this.props;

    const {
      challenges,
      challengeChildren,
      selectedIndex,
      statuses
    } = this.state;

    const currentChallenge = challenges[selectedIndex];
    const challengeStatus = map.determineChallengeStatus(status.success, score);
    const challengesUpdated = [currentChallenge.id];

    updateChallengeStatus(
      currentChallenge.id,
      currentChallenge.familyId,
      challengeStatus
    );
    this.sendChallengeStatement(challengeStatus);

    const canUpdateStatuses = statuses[currentChallenge.id] < challengeStatus;

    // For any incomplete challenge try to reset or increase the streak
    if (canUpdateStatuses && statuses[currentChallenge.id] < CHALLENGE_COMPLETION_STATUS) {
      if (challengeStatus === CHALLENGE_FAILED_STATUS) {
        resetStreakProgress(
          currentChallenge.id,
          currentChallenge.familyId
        );
      } else if (challengeStatus === CHALLENGE_COMPLETION_STATUS
        || challengeStatus === CHALLENGE_PERFECT_STATUS) {
        increaseStreak();
      }
    }

    const updateStatuses = {
      [currentChallenge.id]: canUpdateStatuses ? challengeStatus : statuses[currentChallenge.id]
    };

    // Unlock next node
    if (challengeChildren.length && (challengeStatus === CHALLENGE_COMPLETION_STATUS
      || challengeStatus === CHALLENGE_PERFECT_STATUS) && canUpdateStatuses) {
      challengeChildren.forEach((child) => {
        challengesUpdated.push(child);
        if (_.has(statuses, child) && statuses[child] < CHALLENGE_AVAILABLE_STATUS) {
          updateStatuses[child] = CHALLENGE_AVAILABLE_STATUS;
        }
        updateChallengeStatus(
          child,
          currentChallenge.familyId,
          CHALLENGE_AVAILABLE_STATUS
        );
      });
    }

    this.setChallengeSore(
      canUpdateStatuses,
      challengeStatus,
      currentChallenge.id,
      currentChallenge.isFinal
    );

    // The lastChallengesModified is needed to prevent errors from the react component update
    // lifecycle method and also to ensure that only the last updated challenges are going to
    // change state.
    setLastChallengesModified(challengesUpdated);

    this.setState({
      statuses: {
        ...statuses,
        ...updateStatuses
      },
      isNextUnlocked: !currentChallenge.isFinal && challengeStatus >= CHALLENGE_COMPLETION_STATUS
    });

    if (currentChallenge.isFinal && (challengeStatus === CHALLENGE_COMPLETION_STATUS
      || challengeStatus === CHALLENGE_PERFECT_STATUS)) {
      if (statuses[currentChallenge.id] !== CHALLENGE_COMPLETION_STATUS) {
        increaseProductsCompleted();
      }
      setLastProductCompleted(currentChallenge.productId);
      this.completeFamily(currentChallenge.familyId);
    }
  }

  completeFamily(familyId) {
    const { challenges, setPlayAudio, updateFamilyStatus } = this.props;

    const finalChallenges = challenges.filter(challenge => challenge.familyId === familyId
      && challenge.isFinal);
    const finalCompletedChallenges = finalChallenges.filter(challenge => (
      challenge.status === CHALLENGE_COMPLETION_STATUS
      || challenge.status === CHALLENGE_PERFECT_STATUS));

    if (finalChallenges.length && finalChallenges.length === finalCompletedChallenges.length) {
      updateFamilyStatus(familyId, FAMILY_COMPLETION_STATUS);
      setPlayAudio('au5');
    }
  }

  sendChallengeStatement(status) {
    const { popupReferrer } = this.props;
    const { gomoId } = this.state;
    const result = map.getChallengeXAPIStatus(status);

    sendInteractionData({
      type: 'completed',
      activity: {
        id: gomoId,
        type: 'course',
        title: I18n.t(`xapi.gomo.${gomoId}.title`),
        description: I18n.t(`xapi.gomo.${gomoId}.description`),
        gomoCourse: true
      },
      result: {
        success: result.success,
        score: {
          raw: result.score,
          min: XAPI_CHALLENGE_MIN_SCORE,
          max: XAPI_CHALLENGE_MAX_SCORE
        }
      },
      response: {
        detail: result.response,
        timeAvailable: this.timeAvailable,
        timeResponse: new Date()
      },
      parent: popupReferrer,
    });
  }

  render() {
    const {
      challenges,
      displayResetStreak,
      isNextUnlocked,
      selectedIndex,
      statuses
    } = this.state;

    const buttons = challenges.map((ch, index) => (
      <ChallengeButton
        key={`challengeBtn${index.toString()}`}
        btnIndex={index}
        selectedIndex={selectedIndex}
        status={statuses[ch.id]}
        familyId={ch.familyId}
        onChangeChallenge={this.onChangeChallenge}
      />
    ));
    return (
      <div className="challengeNavigator">
        <button
          type="button"
          className="backBtn"
          disabled={selectedIndex === 0}
          onClick={this.onPreviousChallenge}
        >
          <span className="icon" />
        </button>
        {buttons}
        <button
          type="button"
          className="nextBtn"
          disabled={!isNextUnlocked}
          onClick={this.onNextChallenge}
        >
          <span className="icon" />
        </button>
        <ResetStreakPopup
          displayResetStreak={displayResetStreak}
          onCloseResetStreakPopup={this.onCloseResetStreakPopup}
        />
      </div>
    );
  }
}

ChallengeNavigator.propTypes = {
  active: PropTypes.bool.isRequired,
  challenges: PropTypes.array.isRequired,
  closeChallengesPopupCallback: PropTypes.func.isRequired,
  currentFamily: PropTypes.string.isRequired,
  currentProduct: PropTypes.string.isRequired,
  increaseChallengesCompleted: PropTypes.func.isRequired,
  increasePerfectBonus: PropTypes.func.isRequired,
  increaseProductsCompleted: PropTypes.func.isRequired,
  increaseScore: PropTypes.func.isRequired,
  increaseStreak: PropTypes.func.isRequired,
  onGomoCourseOpened: PropTypes.func.isRequired,
  popupReferrer: PropTypes.string.isRequired,
  resetStreakProgress: PropTypes.func.isRequired,
  setIframeSrc: PropTypes.func.isRequired,
  setLastChallengesModified: PropTypes.func.isRequired,
  setLastProductCompleted: PropTypes.func.isRequired,
  setPlayAudio: PropTypes.func.isRequired,
  streak: PropTypes.number.isRequired,
  updateChallengeStatus: PropTypes.func.isRequired,
  updateFamilyStatus: PropTypes.func.isRequired
};

export const mapStateToProps = state => ({
  active: state.streakData.active,
  challenges: state.mapData.challenges,
  currentFamily: state.mapData.currentFamily,
  currentProduct: state.mapData.currentProduct,
  popupReferrer: state.genericData.popupReferrer,
  streak: state.streakData.progress
});

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(ChallengeNavigator);
