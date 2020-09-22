import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import ScrollBar from 'react-scrollbars-custom';
import AchievementRow from './AchievementRow';
import { getUserAchievementData } from '../../../lib/achievements';
import scrollBarSettings from '../../../config/scrollBar';
import { sendInteractionData } from '../../../tracking/xapi/XApiAdapter';

import './AchievementsView.scss';

export class AchievementsView extends Component {
  constructor(props) {
    super(props);
    this.timeAvailable = null;
  }

  componentDidMount() {
    this.timeAvailable = new Date();
  }

  componentWillUnmount() {
    sendInteractionData({
      type: 'experienced',
      activity: {
        id: 'dashboard/achievements',
        type: 'slide',
        title: I18n.t('xapi.dashboard.achievTitle'),
        description: I18n.t('xapi.dashboard.achievDescription')
      },
      response: {
        timeAvailable: this.timeAvailable,
        timeResponse: new Date()
      },
      parent: 'dashboard'
    });
  }

  render() {
    const {
      challenges,
      clients,
      completedAchievements,
      noOfConsecutiveDays,
      noOfCompletedChallenges,
      noOfCompletedProducts,
      noOfPerfectChallenges,
      totalScore
    } = this.props;

    const products = challenges.filter(ch => ch.isFinal === true);
    const achievementsData = getUserAchievementData(
      {
        completed: completedAchievements,
        clients,
        noOfChallenges: challenges.length,
        noOfCompletedChallenges,
        noOfCompletedProducts,
        noOfConsecutiveDays,
        noOfPerfectChallenges,
        noOfProducts: products.length,
        total: totalScore
      }
    );
    const content = achievementsData.map(ach => (
      <AchievementRow
        key={ach.id}
        achievementId={ach.id}
        complete={ach.completion.complete}
        completion={{
          percent: ach.completion.completedPercent,
          amount: ach.completion.completedAmount,
          total: ach.completion.totalAmount
        }}
        hidden={ach.hidden}
        score={ach.score}
      />
    ));

    return (
      <div className="achievementsView">
        <ScrollBar {...scrollBarSettings}>
          <div className="contentWrapper">
            {content}
          </div>
        </ScrollBar>
      </div>
    );
  }
}

AchievementsView.propTypes = {
  challenges: PropTypes.array.isRequired,
  clients: PropTypes.array.isRequired,
  noOfConsecutiveDays: PropTypes.number.isRequired,
  completedAchievements: PropTypes.array.isRequired,
  noOfCompletedChallenges: PropTypes.number.isRequired,
  noOfCompletedProducts: PropTypes.number.isRequired,
  noOfPerfectChallenges: PropTypes.number.isRequired,
  totalScore: PropTypes.number.isRequired
};

export const mapStateToProps = state => ({
  challenges: state.mapData.challenges,
  completedAchievements: state.achievementsData.completed,
  clients: state.clientProposalData.clients,
  noOfConsecutiveDays: state.genericData.consecutive,
  noOfCompletedChallenges: state.mapData.completedChallenges.length,
  noOfCompletedProducts: state.mapData.completedProducts.length,
  noOfPerfectChallenges: state.mapData.perfect.length,
  totalScore: state.scoreData.total
});

export default connect(
  mapStateToProps
)(AchievementsView);
