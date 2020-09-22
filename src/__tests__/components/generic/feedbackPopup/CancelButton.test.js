/* global toJson */
import React from 'react';
import CancelButton from '../../../../components/generic/feedbackPopup/CancelButton';

test('renders the CancelButton component', () => {
  const wrapper = shallow(<CancelButton onClick={jest.fn()} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
