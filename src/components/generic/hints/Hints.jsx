import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Translate, I18n } from 'react-redux-i18n';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import ActionCreators from '../../../actions/index';
import {
  getHintId,
  getHintIndexFromState,
  getNextHintIndex,
  hintAccessible
} from '../../../lib/hints';
import { HINT_TIME } from '../../../config/hints';

import './Hints.scss';

export class Hints extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hintId: ''
    };
    this.setNextHint = this.setNextHint.bind(this);
  }

  componentDidMount() {
    this.setHint();
    this.interval = setInterval(this.setHint, HINT_TIME);
  }

  componentDidUpdate(prevProps) {
    const {
      clients,
      clientShowing,
      displayReqFeedback,
      completedChallenges,
      completedProducts,
      bonusStreak,
      currentGroup,
      hints,
      paused
    } = this.props;

    const differentGroup = prevProps.currentGroup !== currentGroup;
    const unPaused = prevProps.paused !== paused;
    if (paused) {
      clearInterval(this.interval);
    } else if (differentGroup || unPaused) {
      clearInterval(this.interval);
      this.interval = setInterval(this.setNextHint, HINT_TIME);
      if (differentGroup && prevProps.currentGroup !== '') {
        this.setNextHint();
      } else {
        this.setHint();
      }
    } else if (prevProps.completedChallenges.length !== completedChallenges.length
      || prevProps.completedProducts.length !== completedProducts.length
      || !_.isEqual(prevProps.clients, clients)
      || prevProps.displayReqFeedback !== displayReqFeedback
    ) {
      // Data involved in the calculation of the hints is updated
      const state = {
        clients,
        clientShowing,
        displayReqFeedback,
        completedChallenges,
        completedProducts,
        bonusStreak
      };
      const hintId = getHintId(currentGroup, getHintIndexFromState(hints, currentGroup));
      if (!hintAccessible(currentGroup, hintId, state)) {
        this.setNextHint();
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setHint(nextIndex) {
    const {
      clients,
      clientShowing,
      displayReqFeedback,
      completedChallenges,
      completedProducts,
      bonusStreak,
      hints,
      currentGroup,
      productPageInactive
    } = this.props;
    const state = {
      clients,
      clientShowing,
      displayReqFeedback,
      completedChallenges,
      completedProducts,
      bonusStreak,
      productPageInactive
    };
    const currentIndex = Number.isInteger(nextIndex)
      ? nextIndex
      : getHintIndexFromState(hints, currentGroup);
    if (Number.isInteger(currentIndex)) {
      const hintId = getHintId(currentGroup, currentIndex);
      const hint = hintAccessible(currentGroup, hintId, state) ? hintId : '';
      this.setState({ hintId: hint });
    }
  }

  setNextHint() {
    const {
      clients,
      clientShowing,
      displayReqFeedback,
      completedChallenges,
      completedProducts,
      bonusStreak,
      currentGroup,
      hints,
      productPageInactive,
      setHintGroupIndex
    } = this.props;
    const state = {
      clients,
      clientShowing,
      displayReqFeedback,
      completedChallenges,
      completedProducts,
      bonusStreak,
      productPageInactive
    };
    const group = currentGroup;
    const currentIndex = getHintIndexFromState(hints, group);

    if (Number.isInteger(currentIndex)) {
      const nextIndex = getNextHintIndex(group, currentIndex, state);
      setHintGroupIndex({ group, index: nextIndex });
      this.setHint(nextIndex);
    }
  }

  render() {
    const { hintId } = this.state;
    return (
      <div className="hints">
        <div className="hint">
          <span className="icon" />
          <Translate value="generic.hint" />
        </div>
        <div className="hintText">
          <span className="icon" />
          {hintId && I18n.t(`generic.hints.${hintId}`)}
        </div>
      </div>
    );
  }
}

Hints.propTypes = {
  clients: PropTypes.array.isRequired,
  clientShowing: PropTypes.string.isRequired,
  displayReqFeedback: PropTypes.bool.isRequired,
  completedChallenges: PropTypes.array.isRequired,
  completedProducts: PropTypes.array.isRequired,
  bonusStreak: PropTypes.number.isRequired,
  currentGroup: PropTypes.string.isRequired,
  hints: PropTypes.array.isRequired,
  paused: PropTypes.bool.isRequired,
  productPageInactive: PropTypes.bool.isRequired,
  setHintGroupIndex: PropTypes.func.isRequired
};

export const mapStateToProps = state => ({
  clients: state.clientProposalData.clients,
  clientShowing: state.clientProposalData.clientShowing,
  displayReqFeedback: state.clientProposalData.displayReqFeedback,
  completedChallenges: state.mapData.completedChallenges,
  completedProducts: state.mapData.completedProducts,
  bonusStreak: state.streakData.progress,
  currentGroup: state.hintsData.currentGroup,
  paused: state.hintsData.paused,
  hints: state.hintsData.hints,
  productPageInactive: state.genericData.productPageInactive
});

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hints);
