import React from 'react';
import PropTypes from 'prop-types';
import Star from './Star';

import './DifficultyRating.scss';

const DifficultyRating = ({ numberOfStars, currentRating }) => (
  <div className="difficultyRating">
    {[...Array(+numberOfStars).keys()].map(i => (
      <Star
        key={i + 1}
        className="star"
        active={currentRating >= i + 1}
      />
    ))}
  </div>
);

DifficultyRating.defaultProps = {
  numberOfStars: 3
};

DifficultyRating.propTypes = {
  numberOfStars: PropTypes.number,
  currentRating: PropTypes.number.isRequired
};

export default DifficultyRating;
