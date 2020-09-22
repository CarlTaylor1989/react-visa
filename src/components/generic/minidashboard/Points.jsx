import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CountUp from 'react-countup';
import NumberFormat from 'react-number-format';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import ActionCreators from '../../../actions/index';

import './Points.scss';

export class Points extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startScore: props.displayedScore,
      endScore: props.scoreToDisplay
    };
    this.onAnimationEnded = this.onAnimationEnded.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { scoreToDisplay } = this.props;
    if (prevProps.scoreToDisplay !== scoreToDisplay) {
      this.setScores();
    }
  }

  onAnimationEnded() {
    const { updateDisplayedScore } = this.props;
    const { endScore } = this.state;
    updateDisplayedScore();
    this.setState({
      startScore: endScore
    });
  }

  setScores() {
    const { displayedScore, scoreToDisplay } = this.props;
    this.setState({
      startScore: displayedScore,
      endScore: scoreToDisplay
    });
  }

  render() {
    const { animate, total } = this.props;
    const { startScore, endScore } = this.state;
    return (
      <div className="points">
        <Translate value="generic.miniDashboard.points" />
        <div className="totalContainer">
          {animate ? (
            <CountUp
              start={startScore}
              end={endScore}
              delay={1}
              duration={4}
              separator=","
              onEnd={this.onAnimationEnded}
            />
          ) : (
            <NumberFormat
              value={total}
              displayType="text"
              thousandSeparator=","
            />
          )}
        </div>
      </div>
    );
  }
}

Points.propTypes = {
  animate: PropTypes.bool,
  displayedScore: PropTypes.number.isRequired,
  scoreToDisplay: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  updateDisplayedScore: PropTypes.func.isRequired
};

Points.defaultProps = {
  animate: false
};

export const mapStateToProps = state => ({
  scoreToDisplay: state.scoreData.scoreToDisplay,
  displayedScore: state.scoreData.displayedScore,
  total: state.scoreData.total
});

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Points);
