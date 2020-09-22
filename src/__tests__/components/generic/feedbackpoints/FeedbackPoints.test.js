/* global toJson */
import React from 'react';
import FeedbackPoints from '../../../../components/generic/feedbackpoints/FeedbackPoints';

test('renders the FeedbackPoints component', () => {
  const wrapper = shallow(<FeedbackPoints points={10000} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
