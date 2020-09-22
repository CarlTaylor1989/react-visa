import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StarButton from './StarButton';

import './Rating.scss';

const Rating = ({ numberOfStars, currentRating, setCurrentRating }) => {
  const [hovered, setHovered] = useState(0);

  const handleHover = (event) => {
    setHovered(+event.target.dataset.value);
  };

  const handleMouseLeave = () => {
    setHovered(0);
  };

  const handleFocus = () => null;

  const handleStarClicked = (event) => {
    const rating = event.target.dataset.value;
    setCurrentRating(parseInt(rating, 10));
  };

  return (
    <div className="rating">
      <span className="wrapper" onMouseLeave={handleMouseLeave}>
        {[...Array(+numberOfStars).keys()].map(i => (
          <StarButton
            index={i}
            handleHover={handleHover}
            handleFocus={handleFocus}
            handleClick={handleStarClicked}
            className="star"
            key={i + 1}
            active={currentRating >= i + 1}
            hovered={hovered >= i + 1}
          />
        ))}
      </span>
    </div>
  );
};

Rating.defaultProps = {
  numberOfStars: 5,
};

Rating.propTypes = {
  numberOfStars: PropTypes.number,
  currentRating: PropTypes.number.isRequired,
  setCurrentRating: PropTypes.func.isRequired
};

export default Rating;
