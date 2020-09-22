import React from 'react';
import PropTypes from 'prop-types';

import './StarButton.scss';

const StarButton = ({
  active,
  index,
  handleHover,
  handleFocus,
  handleClick,
  hovered
}) => (
  <button
    className={`starButton${active ? ' is-active' : ''}${hovered ? ' is-hovered' : ''}`}
    key={index + 1}
    data-value={index + 1}
    onMouseOver={handleHover}
    onFocus={handleFocus}
    onClick={handleClick}
    onKeyPress={handleClick}
    type="button"
    tabIndex={index}
  />
);

StarButton.propTypes = {
  active: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  handleHover: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  hovered: PropTypes.bool.isRequired
};

export default StarButton;
