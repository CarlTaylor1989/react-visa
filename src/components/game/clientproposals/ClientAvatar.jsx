import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';

import './ClientAvatar.scss';

const ClientAvatar = ({ client, type }) => (
  <div className={`clientAvatar ${type}`}>
    <span className={`icon ${client}`} />
    <div className="avatarName">
      <Translate
        value={`clientprops.clients.${client}.info.avatarName`}
      />
    </div>
  </div>
);

ClientAvatar.defaultProps = {
  type: 'info'
};

ClientAvatar.propTypes = {
  client: PropTypes.string.isRequired,
  type: PropTypes.string
};

export default ClientAvatar;
