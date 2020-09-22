import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { calculateTotalWins, calculateTotalLosses } from '../../../lib/clients';

import './Proposals.scss';

export const Proposals = (props) => {
  const { wins, losses } = props;
  return (
    <div className="proposals">
      <Translate value="generic.miniDashboard.proposals" />
      <div className="winLossContainer">
        <Translate value="generic.miniDashboard.wins" />
        <div className="winsLosses">
          {`${wins}`}
          <Translate value="generic.miniDashboard.proposalsDivider" />
          {`${losses}`}
        </div>
        <Translate value="generic.miniDashboard.losses" />
      </div>
    </div>
  );
};

Proposals.propTypes = {
  wins: PropTypes.number.isRequired,
  losses: PropTypes.number.isRequired
};

export const mapStateToProps = state => ({
  wins: calculateTotalWins(state.clientProposalData.clients),
  losses: calculateTotalLosses(state.clientProposalData.clients)
});

export default connect(
  mapStateToProps
)(Proposals);
