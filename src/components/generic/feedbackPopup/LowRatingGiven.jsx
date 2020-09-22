import React from 'react';
import { Translate } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import CancelButton from './CancelButton';

const LowRatingGiven = ({
  lowRatingFeedback,
  handleChange,
  submitLowRatingFeedback,
  closePopup
}) => (
  <>
    <div className="popupText">
      <Translate value="generic.feedback.popupLowRatingGiven" />
    </div>
    <textarea value={lowRatingFeedback} onChange={handleChange} />
    <div className="buttons">
      <button
        type="button"
        className={`submitBtn${lowRatingFeedback === '' ? ' disabled' : ''}`}
        disabled={lowRatingFeedback === ''}
        onClick={submitLowRatingFeedback}
      >
        <Translate className="text" value="generic.feedback.submitBtn" />
      </button>
      <CancelButton onClick={closePopup} />
    </div>
  </>
);

LowRatingGiven.propTypes = {
  lowRatingFeedback: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  submitLowRatingFeedback: PropTypes.func.isRequired,
  closePopup: PropTypes.func.isRequired
};

export default LowRatingGiven;
