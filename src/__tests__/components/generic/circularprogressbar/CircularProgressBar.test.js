/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import CircularProgressBar from
  '../../../../components/generic/circularprogressbar/CircularProgressBar';

test('renders the CircularProgressBar component', () => {
  const wrapper = shallow(<CircularProgressBar />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
