import React from 'react';
import PropTypes from 'prop-types';

import './ProgressBar.scss';

export const ProgressBar = (props) => {
  const {
    percent,
    colour
  } = props;
  const style = { width: `${percent}%` };
  return (
    <div className="progressBar">
      <div
        className={`inner ${colour}`}
        style={style}
      />
    </div>
  );
};

ProgressBar.propTypes = {
  percent: PropTypes.number.isRequired,
  colour: PropTypes.string
};

ProgressBar.defaultProps = {
  colour: 'dark'
};

export default ProgressBar;
