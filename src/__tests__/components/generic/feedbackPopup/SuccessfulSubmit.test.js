/* global toJson */
import React from 'react';
import SuccessfulSubmit from '../../../../components/generic/feedbackPopup/SuccessfulSubmit';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    closePopup: jest.fn()
  };
});

test('renders the SuccessfulSubmit component', () => {
  const wrapper = shallow(<SuccessfulSubmit {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
