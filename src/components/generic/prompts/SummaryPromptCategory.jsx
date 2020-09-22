
import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';

import './SummaryPromptCategory.scss';

export const SummaryPromptCategory = ({ category, counter }) => (
  <li className="summaryPromptCategory">
    <Translate value={`generic.prompts.${category}Category`} />
    <Translate value="generic.prompts.multiplier" />
    {counter}
  </li>
);

SummaryPromptCategory.propTypes = {
  category: PropTypes.string.isRequired,
  counter: PropTypes.number.isRequired
};

export default SummaryPromptCategory;
