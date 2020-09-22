/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ProgressBar from '../../../../components/generic/progressbar/ProgressBar';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    percent: 50
  };
});

test('renders the ProgressBar component', () => {
  const wrapper = shallow(<ProgressBar {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
