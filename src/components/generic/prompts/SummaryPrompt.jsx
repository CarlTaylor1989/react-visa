import React, { Component } from 'react';
import _ from 'lodash';
import CountUp from 'react-countup';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Translate } from 'react-redux-i18n';
import SummaryPromptCategory from './SummaryPromptCategory';
import ActionCreators from '../../../actions/index';
import { EXIT_SUMMARY_PROMPT_AFTER } from '../../../config/constants';

import './SummaryPrompt.scss';

export class SummaryPrompt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runningScore: 0
    };
    this.closeSummary = this.closeSummary.bind(this);
    this.onCountdownStart = this.onCountdownStart.bind(this);
    this.timer = null;
  }

  componentDidMount() {
    const { running, setDisplayedScore } = this.props;
    this.timer = setInterval(this.closeSummary, EXIT_SUMMARY_PROMPT_AFTER);
    this.setState({
      runningScore: running
    }, setDisplayedScore);
  }

  componentWillUnmount() {
    const {
      resetRunningCategories,
      resetChangedAchievement,
      resetLastProductCompleted
    } = this.props;
    resetRunningCategories();
    resetChangedAchievement();
    resetLastProductCompleted();
  }

  onCountdownStart() {
    const { setPlayAudio } = this.props;
    setPlayAudio('au1');
  }

  closeSummary() {
    const { closeSummary } = this.props;
    clearInterval(this.timer);
    closeSummary();
  }

  render() {
    const { categories } = this.props;
    const { runningScore } = this.state;

    const categoriesList = [];
    _.forOwn(categories, (value, key) => {
      if (value > 0) {
        categoriesList.push((
          <SummaryPromptCategory
            key={`${key}${value.toString()}`}
            category={key}
            counter={value}
          />
        ));
      }
    });
    return (
      <div className="summaryPrompt">
        <div className="runningPoints">
          <Translate value="generic.prompts.pointsPrefix" />
          <CountUp
            start={runningScore}
            end={0}
            delay={0}
            duration={4}
            separator=","
            onStart={this.onCountdownStart}
          />
        </div>
        <ul className="categories">
          {categoriesList}
        </ul>
      </div>
    );
  }
}

SummaryPrompt.propTypes = {
  categories: PropTypes.object.isRequired,
  closeSummary: PropTypes.func.isRequired,
  resetChangedAchievement: PropTypes.func.isRequired,
  resetRunningCategories: PropTypes.func.isRequired,
  resetLastProductCompleted: PropTypes.func.isRequired,
  running: PropTypes.number.isRequired,
  setDisplayedScore: PropTypes.func.isRequired,
  setPlayAudio: PropTypes.func.isRequired
};

export const mapStateToProps = state => ({
  categories: state.scoreData.categories,
  running: state.scoreData.running
});

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryPrompt);
