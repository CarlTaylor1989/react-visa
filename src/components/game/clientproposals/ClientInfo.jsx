import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import ScrollBar from 'react-scrollbars-custom';
import ClientInfoSummaryItem from './ClientInfoSummaryItem';
import ClientInfoButtons from './ClientInfoButtons';
import ClientAvatar from './ClientAvatar';
import scrollBarSettings from '../../../config/scrollBar';

import './ClientInfo.scss';

const ClientInfo = ({ client, status, attempts }) => (
  <div className="clientInfo">
    <div className="infoSummaryWrapper">
      <div className="summaryItems">
        <ClientInfoSummaryItem fieldName="account" client={client} />
        <ClientInfoSummaryItem fieldName="segment" client={client} />
        <ClientInfoSummaryItem fieldName="region" client={client} />
        <ClientInfoSummaryItem fieldName="bid" client={client} />
        <ClientInfoSummaryItem fieldName="fiscal" client={client} />
        <ClientInfoSummaryItem
          fieldName="difficulty"
          client={client}
          type="difficulty"
        />
      </div>
      <div className="infoContent">
        <Translate
          className="infoTitle"
          value={`clientprops.clients.${client}.info.title`}
        />
        <div className="infoScrollingArea">
          <ScrollBar {...scrollBarSettings}>
            <div className="infoTextWrapper">
              <Translate
                className="infoText"
                dangerousHTML
                value={`clientprops.clients.${client}.info.text`}
              />
            </div>
          </ScrollBar>
        </div>
      </div>
    </div>
    <div className="client">
      <ClientAvatar client={client} />
      <ClientInfoButtons client={client} status={status} />
      <div className="client-attempts">
        <Translate
          value="clientprops.attempts"
          count={attempts}
          dangerousHTML
        />
      </div>
    </div>
  </div>
);

ClientInfo.propTypes = {
  client: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
  attempts: PropTypes.number.isRequired
};

export default ClientInfo;
