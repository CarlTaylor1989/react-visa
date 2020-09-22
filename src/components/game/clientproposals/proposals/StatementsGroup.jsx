import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import clientsConfig from '../../../../config/clients';

import './StatementsGroup.scss';

const StatementsGroup = ({ client, group }) => (
  <div className="statementsGroup">
    <Translate className="groupTitle" value={`clientprops.${group}`} />
    <Translate
      className="required"
      value="clientprops.statementsRequired"
      required={clientsConfig[client][group]}
    />
  </div>
);

StatementsGroup.propTypes = {
  client: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired
};

export default StatementsGroup;
