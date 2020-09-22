import React from 'react';
import PropTypes from 'prop-types';
import { I18n, Translate } from 'react-redux-i18n';
import ClientIcon from '../ClientIcon';

import './ProposalClientIcon.scss';

const ProposalClientIcon = ({ client }) => {
  const problemType = I18n.t(`clientprops.clients.${client}.problemType`);
  return (
    <div className="proposalClientIcon">
      <ClientIcon client={client} proposal />
      <div className="nameType">
        <Translate className="clientName" value={`clientprops.clients.${client}.name`} />
        <Translate className="clientType" value={`clientprops.problems.${problemType}.cpBtn`} />
      </div>
    </div>
  );
};

ProposalClientIcon.propTypes = {
  client: PropTypes.string.isRequired
};

export default ProposalClientIcon;
