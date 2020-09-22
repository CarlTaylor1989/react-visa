import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';

import './PerfectChallenges.scss';

export const PerfectChallenges = ({ current, total }) => (
  <div className="perfectChallenges">
    <Translate className="title" value="network.perfectChallenges" />
    <div className="completedContainer">
      <span className="icon" />
      <div className="completed">
        {current}
        <Translate value="network.perfectChallengesDivider" />
        {total}
      </div>
    </div>
  </div>
);

PerfectChallenges.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
};

export default PerfectChallenges;
