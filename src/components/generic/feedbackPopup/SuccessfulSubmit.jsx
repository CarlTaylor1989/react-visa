import React from 'react';
import { Translate } from 'react-redux-i18n';
import PropTypes from 'prop-types';

const SuccessfulSubmit = ({ closePopup }) => (
  <>
    <div className="popupText">
      <Translate value="generic.feedback.popupSuccesText" />
    </div>
    <div className="buttons">
      <button
        type="button"
        className="closeBtn"
        onClick={closePopup}
      >
        <Translate className="text" value="generic.feedback.closeBtn" />
      </button>
    </div>
  </>
);

SuccessfulSubmit.propTypes = {
  closePopup: PropTypes.func.isRequired,
};

export default SuccessfulSubmit;
