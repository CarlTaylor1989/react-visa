/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import CompletionBar from '../../../../components/generic/completionbar/CompletionBar';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    percent: 75,
    amount: 150,
    total: 200
  };
});

test('renders the CompletionBar component with the total value shown', () => {
  const wrapper = shallow(<CompletionBar {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the CompletionBar component with a hidden text', () => {
  mockProps.displayValue = false;
  mockProps.hiddenTextField = 'generic.dashboard.hiddenValue';
  const wrapper = shallow(<CompletionBar {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
