/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import SummaryPromptCategory from '../../../../components/generic/prompts/SummaryPromptCategory';

test('renders the SummaryPromptCategory', () => {
  const mockProps = {
    category: 'achievements',
    counter: 2
  };
  const wrapper = shallow(<SummaryPromptCategory {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
