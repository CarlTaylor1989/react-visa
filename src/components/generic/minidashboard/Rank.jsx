import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { getPercentageComplete, getRankThreshold } from '../../../lib/ranks';
import ProgressBar from '../progressbar/ProgressBar';

import './Rank.scss';

export const Rank = (props) => {
  const {
    displayThreshold,
    rank,
    total
  } = props;
  const percent = getPercentageComplete(rank, total);
  const threshold = getRankThreshold(rank);

  return (
    <div className="rank">
      <Translate className="label" value="generic.miniDashboard.rank" />
      <div className="rankContainer">
        <div className={`icon ${rank}`} />
        <div className="progress">
          <Translate className="rankName" value={`generic.ranks.${rank}`} />
          <ProgressBar percent={percent} />
          {displayThreshold ? (
            <div className="threshold">
              <NumberFormat
                value={threshold}
                displayType="text"
                thousandSeparator=","
              />
              <Translate value="generic.prompts.points" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

Rank.propTypes = {
  displayThreshold: PropTypes.bool,
  rank: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired
};

Rank.defaultProps = {
  displayThreshold: false
};

export const mapStateToProps = state => ({
  rank: state.scoreData.rank,
  total: state.scoreData.total
});

export default connect(
  mapStateToProps
)(Rank);
