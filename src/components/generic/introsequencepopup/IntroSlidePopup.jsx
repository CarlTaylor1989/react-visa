import React from 'react';
import PropTypes from 'prop-types';

import './IntroSlidePopup.scss';

const IntroSlidePopup = ({ text }) => (
  <div className="introSlidePopup">
    <div className="text">
      {text}
    </div>
  </div>
);

IntroSlidePopup.propTypes = {
  text: PropTypes.string.isRequired
};

export default IntroSlidePopup;
