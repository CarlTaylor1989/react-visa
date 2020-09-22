import React, { Component, createRef } from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { I18n, Translate } from 'react-redux-i18n';
import ScrollBar from 'react-scrollbars-custom';
import ranks from '../../../config/ranks';
import {
  getRankThreshold,
  getPercentageComplete
} from '../../../lib/ranks';
import scrollBarSettings from '../../../config/scrollBar';
import ProgressBar from '../progressbar/ProgressBar';
import Tooltip from '../tooltip/Tooltip';
import { sendInteractionData } from '../../../tracking/xapi/XApiAdapter';

import './RankView.scss';

export class RankView extends Component {
  constructor(props) {
    super(props);
    this.timeAvailable = null;
    this.rankRef = createRef();
    this.state = {
      scrollTop: 0
    };
  }

  componentDidMount() {
    this.timeAvailable = new Date();
    if (this.rankRef.current) {
      this.setState({
        scrollTop: this.rankRef.current.offsetTop - this.rankRef.current.offsetHeight
      });
    }
  }

  componentWillUnmount() {
    sendInteractionData({
      type: 'experienced',
      activity: {
        id: 'dashboard/rank',
        type: 'slide',
        title: I18n.t('xapi.dashboard.rankTitle'),
        description: I18n.t('xapi.dashboard.rankDescription')
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
      rank,
      total
    } = this.props;
    const {
      scrollTop
    } = this.state;
    const threshold = getRankThreshold(rank);
    const percent = getPercentageComplete(rank, total);
    const content = ranks.map(r => (
      <div
        key={r.id}
        ref={r.id === rank ? this.rankRef : null}
        className={`rankRow ${r.id === rank ? ' current' : ''}`}
      >
        <div className="rankIdentifier">
          <div className={`rankRowIcon ${r.id}`} />
          {threshold >= r.threshold ? (
            <Tooltip fieldName="generic.tooltips.dashboard.rank.title">
              <div className="rankRowName">
                <Translate value={`generic.ranks.${r.id}`} />
              </div>
            </Tooltip>
          ) : (
            <div className="rankRowName">
              <Translate value="generic.dashboard.hidden" />
            </div>
          )}
        </div>
        {r.id === rank && (
          <Tooltip fieldName="generic.tooltips.dashboard.rank.progress">
            <div className="progress">
              <ProgressBar percent={percent} />
            </div>
          </Tooltip>
        )}
        <Tooltip fieldName="generic.tooltips.dashboard.rank.points">
          <div className="rankRowPoints">
            <NumberFormat
              value={r.threshold}
              displayType="text"
              thousandSeparator=","
            />
            <Translate value="generic.dashboard.points" />
          </div>
        </Tooltip>
      </div>
    ), this);
    scrollBarSettings.scrollTop = scrollTop;
    return (
      <div className="rankView">
        <ScrollBar {...scrollBarSettings}>
          <div className="contentWrapper">
            {content}
          </div>
        </ScrollBar>
      </div>
    );
  }
}

RankView.propTypes = {
  rank: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired
};

export const mapStateToProps = state => ({
  rank: state.scoreData.rank,
  total: state.scoreData.total
});

export default connect(
  mapStateToProps
)(RankView);
