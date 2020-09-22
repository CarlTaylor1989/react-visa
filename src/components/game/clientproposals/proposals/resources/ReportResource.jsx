import React, { Component } from 'react';
import { Translate, I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import ResourceInlineSVG from './ResourceInlineSVG';
import { getUnloadEventName } from '../../../../../lib/app';
import { sendResourceStatement } from '../../../../../lib/clients';

import './ReportResource.scss';

class ReportResource extends Component {
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
    const description = Object.keys(
      I18n.t(
        `clientprops.clients.${client}.resources.${resourceIndex}.graphs`
      )
    ).map(graph => (
      I18n.t(`clientprops.clients.${client}.resources.${resourceIndex}.graphs.${graph}.text`)
    ));
    sendResourceStatement(
      client,
      I18n.t(`clientprops.clients.${client}.resources.${resourceIndex}.id`),
      I18n.t(`clientprops.clients.${client}.resources.${resourceIndex}.name`),
      description.join(' '),
      this.timeAvailable,
      1
    );
  }

  createReportContent() {
    const { client, resourceIndex } = this.props;
    const content = Object.keys(
      I18n.t(`clientprops.clients.${client}.resources.${resourceIndex}.graphs`)
    ).map((graph, index) => {
      const imageName = I18n.t(
        `clientprops.clients.${client}.resources.${resourceIndex}.graphs.${graph}.imageName`
      );
      return (
        <div className="graphWrapper" key={`graph${index.toString()}`}>
          <ResourceInlineSVG
            type="graphIcon"
            client={client}
            imageName={imageName}
          />
          <div className="graphText">
            <Translate value={
              `clientprops.clients.${client}.resources.${resourceIndex}.graphs.${graph}.text`
            }
            />
          </div>
        </div>
      );
    });
    return content;
  }

  render() {
    const { client, resourceIndex } = this.props;
    const reportContent = this.createReportContent();
    return (
      <div className="reportResource">
        <Translate
          className="reportResourceTitle"
          value={`clientprops.clients.${client}.resources.${resourceIndex}.title`}
        />
        <Translate
          className="reportResourceSubtitle"
          value={`clientprops.clients.${client}.resources.${resourceIndex}.subtitle`}
        />
        <div className="graphsWrapper">{reportContent}</div>
      </div>
    );
  }
}

ReportResource.propTypes = {
  client: PropTypes.string.isRequired,
  resourceIndex: PropTypes.string.isRequired
};

export default ReportResource;
