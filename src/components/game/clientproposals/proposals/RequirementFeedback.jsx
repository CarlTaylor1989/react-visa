import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import ScrollBar from 'react-scrollbars-custom';
import FeedbackPoints from '../../../generic/feedbackpoints/FeedbackPoints';
import { REQUIREMENT_MAX_ATTEMPTS } from '../../../../config/clients';
import { getRemainingAttempts } from '../../../../lib/clients';
import scrollBarSettings from '../../../../config/scrollBar';

import './RequirementFeedback.scss';

class RequirementFeedback extends Component {
  componentDidUpdate(props) {
    const { clientData, onLockClient, showFeedback } = this.props;
    if (!props.showFeedback && showFeedback) {
      if (!clientData.reqCorrect && clientData.reqAttempts % REQUIREMENT_MAX_ATTEMPTS === 0) {
        onLockClient();
      }
    }
  }

  render() {
    const {
      clientData,
      onAnswerCorrectly,
      onLocked,
      onRetry,
      points,
      showFeedback
    } = this.props;
    const isCorrect = !!(clientData && clientData.reqCorrect);
    let extraClasses = showFeedback ? ' available' : '';
    extraClasses = isCorrect ? `${extraClasses} correct` : `${extraClasses} incorrect`;

    return (
      <div className={`requirementFeedback${extraClasses}`}>
        <div className="popupWrapper">
          <span className="feedbackIcon" />
          {showFeedback && clientData && clientData.reqCorrect && (
            <>
              <Translate
                className="feedbackTitle"
                value="clientprops.correctRequirementFeedbackTitle"
              />
              <div className="scrollingArea">
                <ScrollBar {...scrollBarSettings}>
                  <div className="scrollingContent">
                    <Translate
                      className="feedbackText"
                      dangerousHTML
                      value={`clientprops.clients.${clientData.id}.correctFeedback`}
                      attempts={clientData.reqAttempts}
                    />
                  </div>
                </ScrollBar>
              </div>
              <FeedbackPoints points={points} showTotalText={false} />
              <button
                type="button"
                className="feedbackBtn"
                onClick={onAnswerCorrectly}
              >
                <Translate value="clientprops.okBtn" />
              </button>
            </>
          )}
          {showFeedback && clientData && !clientData.reqCorrect && (
            <>
              <Translate
                className="feedbackTitle"
                value="clientprops.incorrectRequirementFeedbackTitle"
              />
              <div className="scrollingArea">
                <ScrollBar {...scrollBarSettings}>
                  <div className="scrollingContent">
                    <Translate
                      className="feedbackText"
                      dangerousHTML
                      value={`clientprops.clients.${clientData.id}.incorrectFeedback`}
                      remaining={getRemainingAttempts(clientData.reqAttempts)}
                    />
                  </div>
                </ScrollBar>
              </div>
              {(clientData.reqAttempts % REQUIREMENT_MAX_ATTEMPTS === 0) ? (
                <button
                  type="button"
                  className="feedbackBtn"
                  onClick={onLocked}
                >
                  <Translate value="clientprops.okBtn" />
                </button>
              ) : (
                <button
                  type="button"
                  className="feedbackBtn"
                  onClick={onRetry}
                >
                  <Translate value="clientprops.retryBtn" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

RequirementFeedback.defaultProps = {
  clientData: null
};

RequirementFeedback.propTypes = {
  clientData: PropTypes.object,
  onAnswerCorrectly: PropTypes.func.isRequired,
  onLocked: PropTypes.func.isRequired,
  onLockClient: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  points: PropTypes.number.isRequired,
  showFeedback: PropTypes.bool.isRequired,
};

export default RequirementFeedback;
