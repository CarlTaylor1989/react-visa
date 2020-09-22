import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';

import './CancelButton.scss';

const CancelButton = ({ onClick }) => (
  <button
    type="button"
    className="cancelBtn"
    onClick={onClick}
  >
    <Translate className="text" value="generic.feedback.cancelBtn" />
    <span className="icon" />
  </button>
);

CancelButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default CancelButton;
