import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import NumberFormat from 'react-number-format';

import './CompletionBar.scss';

const CompletionBar = (props) => {
  const {
    amount,
    displayValue,
    hiddenTextField,
    percent,
    total
  } = props;
  const style = { width: `${percent}%` };
  return (
    <div className="completionBar">
      <div className="inner" style={style} />
      <div className="completion">
        <NumberFormat
          value={amount}
          displayType="text"
          thousandSeparator=","
        />
        <Translate value="generic.completionProgressDivider" />
        {displayValue ? (
          <NumberFormat
            value={total}
            displayType="text"
            thousandSeparator=","
          />
        ) : (
          <Translate value={hiddenTextField} />
        )}
      </div>
    </div>
  );
};

CompletionBar.propTypes = {
  amount: PropTypes.number.isRequired,
  displayValue: PropTypes.bool,
  hiddenTextField: PropTypes.string,
  percent: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
};

CompletionBar.defaultProps = {
  displayValue: true,
  hiddenTextField: ''
};

export default CompletionBar;
