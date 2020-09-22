import React from 'react';
import PropTypes from 'prop-types';

import './ClientIcon.scss';

const ClientIcon = ({ client, proposal }) => (
  <div className={`clientIcon ${client}${proposal ? ' proposal' : ''}`}>
    <span className="iconImage" />
  </div>
);

ClientIcon.defaultProps = {
  proposal: false
};

ClientIcon.propTypes = {
  client: PropTypes.string.isRequired,
  proposal: PropTypes.bool,
};

export default ClientIcon;
