import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n, Translate } from 'react-redux-i18n';
import ResourceInlineSVG from './ResourceInlineSVG';
import { getUnloadEventName } from '../../../../../lib/app';
import { getAppRoot } from '../../../../../lib/audio';
import { sendResourceStatement } from '../../../../../lib/clients';

import './CallResource.scss';

class CallResource extends Component {
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
      I18n.t(`clientprops.clients.${client}.resources.${resourceIndex}.transcript`),
      this.timeAvailable,
      1
    );
  }

  render() {
    const { client, resourceIndex } = this.props;
    const imageName = I18n.t(`clientprops.clients.${client}.resources.${resourceIndex}.imageName`);
    const audioName = I18n.t(`clientprops.clients.${client}.resources.${resourceIndex}.audioName`);
    const audioSrc = `${getAppRoot()}clients/${client}/${audioName}`;
    return (
      <div className="callResource">
        <div className="callDetails">
          <div className="client">
            <ResourceInlineSVG
              type="clientAvatar"
              client={client}
              imageName={imageName}
            />
            <div className="title">
              <Translate
                value={`clientprops.clients.${client}.resources.${resourceIndex}.title`}
              />
            </div>
          </div>
          <div className="information">
            <Translate
              value={`clientprops.clients.${client}.resources.${resourceIndex}.caller`}
            />
          </div>
        </div>
        <div className="instruction">
          <Translate
            value={`clientprops.clients.${client}.resources.${resourceIndex}.instruction`}
          />
        </div>
        <audio
          className="audio"
          controls
          src={audioSrc}
        />
        <div className="transcript">
          <Translate
            dangerousHTML
            value={`clientprops.clients.${client}.resources.${resourceIndex}.transcript`}
          />
        </div>
      </div>
    );
  }
}

CallResource.propTypes = {
  client: PropTypes.string.isRequired,
  resourceIndex: PropTypes.string.isRequired
};

export default CallResource;
