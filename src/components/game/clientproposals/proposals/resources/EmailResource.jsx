import React, { Component } from 'react';
import { I18n, Translate } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import ResourceInlineSVG from './ResourceInlineSVG';
import { getUnloadEventName } from '../../../../../lib/app';
import { sendResourceStatement } from '../../../../../lib/clients';

import './EmailResource.scss';

class EmailResource extends Component {
  constructor() {
    super();
    this.timeAvailable = null;
  }

  componentDidMount() {
    this.timeAvailable = new Date();
    window.addEventListener(getUnloadEventName(), this.sendStatement);
  }

  componentWillUnmount() {
    this.sendStatement();
    window.removeEventListener(getUnloadEventName(), this.sendStatement);
  }

  sendStatement() {
    const { client, resourceIndex } = this.props;
    sendResourceStatement(
      client,
      I18n.t(`clientprops.clients.${client}.resources.${resourceIndex}.id`),
      I18n.t(`clientprops.clients.${client}.resources.${resourceIndex}.name`),
      I18n.t(`clientprops.clients.${client}.resources.${resourceIndex}.body`),
      this.timeAvailable,
      1
    );
  }

  render() {
    const { client, resourceIndex } = this.props;
    const imageName = I18n.t(`clientprops.clients.${client}.resources.${resourceIndex}.imageName`);
    return (
      <div className="emailResource">
        <span className="emailHeader" />
        <div className="emailInformation">
          <ResourceInlineSVG
            type="clientAvatar"
            client={client}
            imageName={imageName}
          />
          <Translate
            className="sender"
            value={`clientprops.clients.${client}.resources.${resourceIndex}.sender`}
          />
        </div>
        <Translate
          className="subject"
          value={`clientprops.clients.${client}.resources.${resourceIndex}.subject`}
        />
        <Translate
          dangerousHTML
          className="body"
          value={`clientprops.clients.${client}.resources.${resourceIndex}.body`}
        />
      </div>
    );
  }
}

EmailResource.propTypes = {
  client: PropTypes.string.isRequired,
  resourceIndex: PropTypes.string.isRequired
};

export default EmailResource;
