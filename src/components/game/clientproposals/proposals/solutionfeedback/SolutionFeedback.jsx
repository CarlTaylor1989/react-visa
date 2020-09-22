import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Translate } from 'react-redux-i18n';
import ScrollBar from 'react-scrollbars-custom';
import modalSettings from '../../../../../config/modalsettings';
import { CLIENT_GIVENUP } from '../../../../../config/constants';
import { clientsSelectorPath } from '../../../../../config/navigation';
import scrollBarSettings from '../../../../../config/scrollBar';
import ShowSolutionPrompt from './ShowSolutionPrompt';
import FeedbackPoints from '../../../../generic/feedbackpoints/FeedbackPoints';

import './SolutionFeedback.scss';

export class SolutionFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPrompt: false
    };

    this.onOpenPrompt = this.onOpenPrompt.bind(this);
    this.onClosePrompt = this.onClosePrompt.bind(this);
    this.onGiveUp = this.onGiveUp.bind(this);
  }

  componentWillUnmount() {
    const { onModalExited } = this.props;
    onModalExited();
  }

  onOpenPrompt() {
    this.setState({ showPrompt: true });
  }

  onClosePrompt() {
    this.setState({ showPrompt: false });
  }

  onGiveUp() {
    const { clientData, setClientStatus } = this.props;
    setClientStatus(clientData.id, CLIENT_GIVENUP);
    this.setState({ showPrompt: false });
  }

  render() {
    const {
      clientData,
      closePopup,
      onAnswerCorrectly,
      onModalExited,
      onModalOpen,
      showPopup
    } = this.props;
    const { showPrompt } = this.state;
    const isCorrect = (clientData && clientData.solutionCorrect) ? ' correct' : ' incorrect';
    const hasGivenUp = clientData && clientData.status === CLIENT_GIVENUP;

    return (
      <Modal
        open={showPopup}
        classNames={{
          modal: `solutionFeedback${isCorrect}`,
          overlay: 'solutionFeedbackOverlay'
        }}
        container={document.getElementById('app')}
        onClose={closePopup}
        onModalExited={onModalExited}
        onEntered={onModalOpen}
        {...modalSettings}
      >
        <div className="animatedBackground" />
        <div className="woman" />
        <div className="popupWrapper">
          {showPopup && clientData && clientData.solutionCorrect && (
            <>
              <div className="leftColumn">
                <div className="popupTitle">
                  <Translate value="clientprops.correctSolutionFeedbackTitle" />
                </div>
                <div className="scrollingArea">
                  <ScrollBar {...scrollBarSettings}>
                    <div className="scrollWrapper">
                      <Translate
                        className="feedbackText"
                        dangerousHTML
                        value={`clientprops.clients.${clientData.id}.correctSolutionFeedback`}
                      />
                    </div>
                  </ScrollBar>
                </div>
              </div>
              <div className="rightColumn">
                <Translate
                  className="solutionAttempts"
                  dangerousHTML
                  value="clientprops.solutionAttempts"
                  attempts={clientData.solutionAttempts}
                />
                <div className="pointsWrapper">
                  <FeedbackPoints points={clientData.solutionScore} showTotalText={false} />
                </div>
                <Translate
                  className="nextSteps"
                  value="clientprops.correctSolutionFeedbackNextSteps"
                />
                <div className="feedbackWrapper">
                  <NavLink
                    className="feedbackBtn"
                    to={`${clientsSelectorPath}`}
                    onClick={onAnswerCorrectly}
                  >
                    <Translate value="clientprops.okBtn" />
                  </NavLink>
                </div>
              </div>
            </>
          )}
          {showPopup && clientData && !clientData.solutionCorrect && !hasGivenUp && (
            <>
              <div className="leftColumn">
                <div className="popupTitle">
                  <Translate value="clientprops.incorrectSolutionFeedbackTitle" />
                </div>
                <Translate
                  className="feedbackText"
                  dangerousHTML
                  value={`clientprops.clients.${clientData.id}.incorrectSolutionFeedback`}
                />
                <div className="feedbackWrapper">
                  <button
                    type="button"
                    className="feedbackBtn"
                    onClick={closePopup}
                  >
                    <Translate value="clientprops.retryBtn" />
                  </button>
                </div>
                <button
                  type="button"
                  className="feedbackShowSolutionBtn"
                  onClick={this.onOpenPrompt}
                >
                  <Translate className="showTheSolutionText" value="clientprops.showTheSolution" />
                  <span className="arrowRight" />
                </button>
              </div>
              <button
                type="button"
                className="exitPopup"
                onClick={closePopup}
              >
                <Translate value="generic.popupCloseBtn" />
              </button>
            </>
          )}
          {showPopup && clientData && !clientData.solutionCorrect && hasGivenUp && (
            <>
              <div className="leftColumn givenUp">
                <div className="popupTitle">
                  <Translate value="clientprops.givenUpSolutionFeedbackTitle" />
                </div>
                <div className="scrollingArea">
                  <ScrollBar {...scrollBarSettings}>
                    <div className="scrollWrapper">
                      <Translate
                        className="feedbackText"
                        dangerousHTML
                        value={`clientprops.clients.${clientData.id}.givenUpSolutionFeedback`}
                      />
                    </div>
                  </ScrollBar>
                </div>
              </div>
              <div className="rightColumn">
                <Translate
                  className="solutionAttempts"
                  dangerousHTML
                  value="clientprops.solutionAttempts"
                  attempts={clientData.solutionAttempts}
                />
                <div className="pointsWrapper">
                  <FeedbackPoints points={clientData.solutionScore} showTotalText={false} />
                </div>
                <Translate
                  className="nextSteps"
                  value="clientprops.givenUpSolutionFeedbackNextSteps"
                />
                <div className="feedbackWrapper">
                  <NavLink
                    className="feedbackBtn"
                    to={`${clientsSelectorPath}`}
                    onClick={closePopup}
                  >
                    <Translate value="clientprops.okBtn" />
                  </NavLink>
                </div>
              </div>
            </>
          )}
        </div>
        <ShowSolutionPrompt
          showPrompt={showPrompt}
          closePrompt={this.onClosePrompt}
          onGiveUp={this.onGiveUp}
        />
      </Modal>
    );
  }
}

SolutionFeedback.defaultProps = {
  clientData: null
};

SolutionFeedback.propTypes = {
  clientData: PropTypes.object,
  closePopup: PropTypes.func.isRequired,
  onAnswerCorrectly: PropTypes.func.isRequired,
  onModalExited: PropTypes.func.isRequired,
  onModalOpen: PropTypes.func.isRequired,
  setClientStatus: PropTypes.func.isRequired,
  showPopup: PropTypes.bool.isRequired
};

export default SolutionFeedback;
