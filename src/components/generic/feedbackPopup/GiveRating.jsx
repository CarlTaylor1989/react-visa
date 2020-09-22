import React from 'react';
import { Translate } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import Rating from '../rating/Rating';
import CancelButton from './CancelButton';

const GiveRating = ({
  currentRating,
  setCurrentRating,
  submitRating,
  closePopup
}) => (
  <>
    <div className="popupTitle">
      <Translate value="generic.feedback.popupTitle" />
    </div>
    <div className="popupText">
      <Translate value="generic.feedback.popupGiveRatingText" />
    </div>
    <Rating currentRating={currentRating} setCurrentRating={setCurrentRating} />
    <div className="buttons">
      <button
        type="button"
        className={`submitBtn${currentRating === 0 ? ' disabled' : ''}`}
        disabled={currentRating === 0}
        onClick={submitRating}
      >
        <Translate className="text" value="generic.feedback.submitBtn" />
      </button>
      <CancelButton onClick={closePopup} />
    </div>
  </>
);

GiveRating.propTypes = {
  currentRating: PropTypes.number.isRequired,
  setCurrentRating: PropTypes.func.isRequired,
  submitRating: PropTypes.func.isRequired,
  closePopup: PropTypes.func.isRequired,
};

export default GiveRating;
