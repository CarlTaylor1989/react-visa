import React, { Component } from 'react';
import { I18n, Translate } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import ScrollBar from 'react-scrollbars-custom';
import scrollBarSettings from '../../../../config/scrollBar';
import { sendInteractionData } from '../../../../tracking/xapi/XApiAdapter';
import { clientsPropsReferrer } from '../../../../config/referrers';

import './SolutionsInfo.scss';

class SolutionsInfo extends Component {
  constructor(props) {
    super(props);
    this.timeAvailable = null;
    this.onClose = this.onClose.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { showInfo } = this.props;

    if (!prevProps.showInfo && showInfo) {
      this.timeAvailable = new Date();
    }
  }

  componentWillUnmount() {
    const { client, id } = this.props;

    if (client && id && this.timeAvailable) {
      this.sendPopupStatement();
    }
  }

  onClose() {
    const { closeInfo } = this.props;
    this.sendPopupStatement();
    closeInfo();
  }

  sendPopupStatement() {
    const { client, id } = this.props;

    sendInteractionData({
      type: 'experienced',
      activity: {
        id: `${clientsPropsReferrer}/${client}/question-2/plm${id}`,
        type: 'slide',
        title: I18n.t('xapi.clientproposals.learnMoreTitle', {
          product: I18n.t(`clientprops.clients.${client}.products.${id}.title`)
        }),
        description: I18n.t(`clientprops.clients.${client}.products.${id}.text`)
      },
      response: {
        timeAvailable: this.timeAvailable,
        timeResponse: new Date()
      },
      parent: `${clientsPropsReferrer}/${client}/question-2`
    });

    this.timeAvailable = null;
  }

  render() {
    const {
      id,
      client,
      showInfo
    } = this.props;

    return (
      <div className={`solutionsInfo${showInfo ? ' available' : ''}`}>
        <button
          type="button"
          className="exitPopup"
          onClick={this.onClose}
        >
          <Translate value="generic.popupCloseBtn" />
        </button>
        <div className="contentScroll">
          <ScrollBar {...scrollBarSettings}>
            <div className="popupWrapper">
              <Translate
                className="solutionTitle"
                dangerousHTML
                value={`clientprops.clients.${client}.products.${id}.popupTitle`}
              />
              <Translate
                className="solutionSubtitle"
                dangerousHTML
                value={`clientprops.clients.${client}.products.${id}.popupSubtitle`}
              />
              <Translate
                className="solutionText"
                dangerousHTML
                value={`clientprops.clients.${client}.products.${id}.popupText`}
              />
            </div>
          </ScrollBar>
        </div>
      </div>
    );
  }
}

SolutionsInfo.propTypes = {
  id: PropTypes.string.isRequired,
  client: PropTypes.string.isRequired,
  closeInfo: PropTypes.func.isRequired,
  showInfo: PropTypes.bool.isRequired
};

export default SolutionsInfo;
