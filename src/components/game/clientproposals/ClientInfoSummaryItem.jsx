import React from 'react';
import PropTypes from 'prop-types';
import { I18n, Translate } from 'react-redux-i18n';
import DifficultyRating from '../../generic/rating/DifficultyRating';
import clientData from '../../../config/clients';

import './ClientInfoSummaryItem.scss';

const ClientInfoSummaryItem = ({ client, fieldName, type }) => (
  <div className={`clientInfoSummaryItem ${type}`}>
    <Translate className="infoSummaryTitle" value={`clientprops.info.${fieldName}`} />
    {type !== 'difficulty' ? (
      <span
        dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
          __html: I18n.t(`clientprops.clients.${client}.info.${fieldName}`)
        }}
        className="infoSummaryText"
      />
    ) : (
      <DifficultyRating currentRating={clientData[client].difficulty} />
    )}
  </div>
);

ClientInfoSummaryItem.defaultProps = {
  type: ''
};

ClientInfoSummaryItem.propTypes = {
  client: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  type: PropTypes.string
};

export default ClientInfoSummaryItem;
