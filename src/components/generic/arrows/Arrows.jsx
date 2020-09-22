import React from 'react';
import PropTypes from 'prop-types';

import './Arrows.scss';

const Arrows = ({ direction }) => (
  <div className={`arrows ${direction}`}>
    <span className="arrow" />
    <span className="arrow" />
    <span className="arrow" />
  </div>
);

Arrows.propTypes = {
  direction: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
};

Arrows.defaultProps = {
  direction: 'bottom'
};

export default Arrows;
