import React from 'react';
import PropTypes from 'prop-types';

import './CheckboxLabel.scss';

const CheckboxLabel = ({
  disabled,
  elementId,
  label,
  isSelected,
  onCheckboxChange
}) => (
  <div className={`checkboxLabel${disabled ? ' disabled' : ''}`}>
    <label htmlFor={elementId}>
      <input
        id={elementId}
        type="checkbox"
        disabled={disabled}
        checked={isSelected}
        onChange={() => onCheckboxChange(elementId)}
        className="checkbox"
      />
      <span className="label">{label}</span>
      <span className="checkmark" />
    </label>
  </div>
);

CheckboxLabel.defaultProps = {
  disabled: false
};

CheckboxLabel.propTypes = {
  disabled: PropTypes.bool,
  elementId: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onCheckboxChange: PropTypes.func.isRequired
};

export default CheckboxLabel;
