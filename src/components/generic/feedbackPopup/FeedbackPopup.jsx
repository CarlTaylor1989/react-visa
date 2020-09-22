import React, { useState } from 'react';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';
import { I18n, Translate } from 'react-redux-i18n';
import modalSettings from '../../../config/modalsettings';
import GiveRating from './GiveRating';
import LowRatingGiven from './LowRatingGiven';
import SuccessfulSubmit from './SuccessfulSubmit';
import { sendInteractionData } from '../../../tracking/xapi/XApiAdapter';
import {
  XAPI_FEEDBACK_MIN_RATING,
  XAPI_FEEDBACK_MAX_RATING
} from '../../../config/constants';

import './FeedbackPopup.scss';

export const FeedbackPopup = ({ closePopup, showPopup }) => {
  const [currentRating, setCurrentRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [lowRatingGiven, setLowRatingGiven] = useState(false);
  const [lowRatingFeedback, setLowRatingFeedback] = useState('');

  const submitRating = () => {
    if (currentRating < 3) {
      setLowRatingGiven(true);
    } else {
      sendInteractionData({
        type: 'rated',
        activity: {
          id: 'feedback/thirdday/starrating',
          type: 'survey',
          title: I18n.t('xapi.feedback.title'),
          description: I18n.t('xapi.feedback.description'),
        },
        result: {
          score: {
            raw: currentRating,
            min: XAPI_FEEDBACK_MIN_RATING,
            max: XAPI_FEEDBACK_MAX_RATING
          }
        },
        parent: ''
      });
    }

    setRatingSubmitted(true);
  };

  const handleLowScoreFeedbackChange = (event) => {
    setLowRatingFeedback(event.target.value);
  };

  const submitLowRatingFeedback = () => {
    sendInteractionData({
      type: 'rated',
      activity: {
        id: 'feedback/thirdday/starrating',
        type: 'survey',
        title: I18n.t('xapi.feedback.title'),
        description: I18n.t('xapi.feedback.description')
      },
      result: {
        score: {
          raw: currentRating,
          min: XAPI_FEEDBACK_MIN_RATING,
          max: XAPI_FEEDBACK_MAX_RATING
        },
        response: lowRatingFeedback.replace(/\n/g, ' ')
      },
      parent: ''
    });
    closePopup();
  };

  let extraClasses = ratingSubmitted && lowRatingGiven ? ' low-rating' : '';
  extraClasses = ratingSubmitted && !lowRatingGiven
    ? `${extraClasses} successful-submit`
    : extraClasses;

  return (
    <Modal
      open={showPopup}
      classNames={{
        modal: 'feedbackPopup',
        overlay: 'feedbackPopupOverlay'
      }}
      container={document.getElementById('app')}
      onClose={closePopup}
      {...modalSettings}
    >
      <span className="bgIcons starsLeft" />
      <span className="bgIcons starsRight" />
      <span className="bgIcons bars" />
      <span className="bgIcons loaders" />
      <div className={`popupWrapper${extraClasses}`}>
        {ratingSubmitted ? (
          <>
            <div className="popupTitle">
              <Translate value="generic.feedback.popupSubmittedTitle" />
            </div>
            {lowRatingGiven ? (
              <LowRatingGiven
                lowRatingFeedback={lowRatingFeedback}
                handleChange={handleLowScoreFeedbackChange}
                submitLowRatingFeedback={submitLowRatingFeedback}
                closePopup={closePopup}
              />
            ) : (
              <SuccessfulSubmit closePopup={closePopup} />
            )}
          </>
        ) : (
          <GiveRating
            currentRating={currentRating}
            setCurrentRating={setCurrentRating}
            submitRating={submitRating}
            closePopup={closePopup}
          />
        )}
      </div>
    </Modal>
  );
};

FeedbackPopup.propTypes = {
  closePopup: PropTypes.func.isRequired,
  showPopup: PropTypes.bool.isRequired,
};

export default FeedbackPopup;
