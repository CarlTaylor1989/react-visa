import React from 'react';
import PropTypes from 'prop-types';

import './Star.scss';

const StarButton = ({ active }) => (
  <span className={`star${active ? ' active' : ''}`} />
);

StarButton.propTypes = {
  active: PropTypes.bool.isRequired
};

export default StarButton;
