/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  ChallengeStreak,
  mapStateToProps
} from '../../../../components/generic/minidashboard/ChallengeStreak';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    progress: 0
  };
});

test('renders the ChallengeStreak component', () => {
  const wrapper = shallow(<ChallengeStreak {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ChallengeStreak component with progress of two', () => {
  const wrapper = shallow(<ChallengeStreak {...mockProps} progress={2} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('should mapStateToProps', () => {
  const state = {
    streakData: {
      progress: 0
    }
  };

  const props = mapStateToProps(state);
  expect(props).toEqual({
    ...state.streakData
  });
});
