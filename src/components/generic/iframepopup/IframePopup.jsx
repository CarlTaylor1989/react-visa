/* eslint-disable react/no-unused-state */
import { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { loadSco } from '../../../lib/loadsco';
import { hideCourseExit } from '../../../lib/iframecontent';
import { sendInteractionData } from '../../../tracking/xapi/XApiAdapter';

import './IframePopup.scss';

class IframePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayError: false,
      dummySco: true,
      iframeSrc: '',
      showLoader: true
    };

    this.hideIframePopupLoader = this.hideIframePopupLoader.bind(this);
    this.onExitSco = this.onExitSco.bind(this);
    this.onIframeLoaded = this.onIframeLoaded.bind(this);
    this.onGomoCourseOpened = this.onGomoCourseOpened.bind(this);
    this.setIframeRef = this.setIframeRef.bind(this);
  }

  onIframeLoaded() {
    const { dummySco } = this.state;
    if (!dummySco) {
      loadSco(this.scoIframe);
      hideCourseExit(this.scoIframe);
    }
    setTimeout(this.hideIframePopupLoader, 5000);
  }

  onExitSco() {
    const { closePopup } = this.props;
    const cw = this.scoIframe.contentWindow;

    // Call commit in the gomo course
    if (cw && cw.CONTENT_TRACKING && cw.CONTENT_TRACKING.saveState) {
      cw.CONTENT_TRACKING.saveState();
    }

    this.scoIframe.src = '';
    closePopup();
  }

  onGomoCourseOpened(gomoId) {
    const { popupReferrer } = this.props;
    sendInteractionData({
      type: 'opened',
      activity: {
        id: gomoId,
        type: 'course',
        title: I18n.t(`xapi.gomo.${gomoId}.title`),
        description: I18n.t(`xapi.gomo.${gomoId}.description`),
        gomoCourse: true
      },
      parent: popupReferrer,
      referrer: popupReferrer
    });
  }

  setIframeRef(element) {
    this.scoIframe = element;
  }

  hideIframePopupLoader() {
    this.setState({
      showLoader: false
    });
  }

  displayIframePopupLoader() {
    this.setState({
      displayError: false,
      showLoader: true
    });
  }

  render() {
    return null;
  }
}

IframePopup.propTypes = {
  closePopup: PropTypes.func.isRequired,
  popupReferrer: PropTypes.string.isRequired
};

export default IframePopup;
