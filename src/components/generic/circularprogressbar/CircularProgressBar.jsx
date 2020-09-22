import React from 'react';
import PropTypes from 'prop-types';

import './CircularProgressBar.scss';

const CircularProgressBar = ({
  size, // Size of the enclosing square
  strokeWidth,
  percentage
}) => {
  // SVG centers the stroke width on the radius, subtract out so circle fits in square
  const radius = (size - strokeWidth) / 2;
  // Enclose cicle in a circumscribing square
  const viewBox = `0 0 ${size} ${size}`;
  // Arc length at 100% coverage is the circle circumference
  const dashArray = radius * Math.PI * 2;
  // Scale 100% coverage overlay with the actual percent
  const dashOffset = -(dashArray - dashArray * percentage / 100);

  return (
    <svg
      className="circularProgressBar"
      width={size}
      height={size}
      viewBox={viewBox}
    >
      <circle
        className="circle-background"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
      />
      <circle
        className="circle-progress"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        // Start progress marker at 12 O'Clock
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset
        }}
      />
    </svg>
  );
};

CircularProgressBar.defaultProps = {
  percentage: 100,
  size: 134,
  strokeWidth: 8
};

CircularProgressBar.propTypes = {
  percentage: PropTypes.number,
  size: PropTypes.number,
  strokeWidth: PropTypes.number
};

export default CircularProgressBar;
