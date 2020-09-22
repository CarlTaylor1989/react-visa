/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  Rank,
  mapStateToProps
} from '../../../../components/generic/minidashboard/Rank';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    rank: 'r20',
    total: 0
  };
});

test('renders the Rank component without the threshold', () => {
  const wrapper = shallow(<Rank {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the Rank component with the threshold', () => {
  const wrapper = shallow(<Rank {...mockProps} displayThreshold />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('should mapStateToProps', () => {
  const state = {
    scoreData: {
      rank: 'r2',
      total: 10500001
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual(state.scoreData);
});
