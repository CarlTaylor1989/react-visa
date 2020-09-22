import React, { Component } from 'react';
import { I18n, Translate } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import { getUnloadEventName } from '../../../../../lib/app';
import { sendResourceStatement } from '../../../../../lib/clients';

import './MeetingResource.scss';

class MeetingResouce extends Component {
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
      I18n.t(`clientprops.clients.${client}.resources.${resourceIndex}.content`),
      this.timeAvailable,
      1
    );
  }

  render() {
    const { client, resourceIndex } = this.props;
    return (
      <div className="meetingResource">
        <Translate
          className="title"
          value={`clientprops.clients.${client}.resources.${resourceIndex}.title`}
        />
        <Translate
          dangerousHTML
          className="content"
          value={`clientprops.clients.${client}.resources.${resourceIndex}.content`}
        />
      </div>
    );
  }
}

MeetingResouce.propTypes = {
  client: PropTypes.string.isRequired,
  resourceIndex: PropTypes.string.isRequired
};

export default MeetingResouce;
