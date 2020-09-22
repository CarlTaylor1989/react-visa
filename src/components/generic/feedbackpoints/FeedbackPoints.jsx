import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { Translate } from 'react-redux-i18n';

import './FeedbackPoints.scss';

const FeedbackPoints = ({ points, showTotalText }) => (
  <div className="feedbackPoints">
    {showTotalText && (
      <Translate className="text" value="clientprops.total" />
    )}
    <div className="pointsContainer">
      <NumberFormat
        className="pointsText"
        value={points}
        displayType="text"
        thousandSeparator=","
      />
    </div>
    <Translate className="text" value="clientprops.points" />
  </div>
);

FeedbackPoints.defaultProps = {
  showTotalText: true
};

FeedbackPoints.propTypes = {
  points: PropTypes.number.isRequired,
  showTotalText: PropTypes.bool
};

export default FeedbackPoints;
