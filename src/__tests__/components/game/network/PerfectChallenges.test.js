/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import PerfectChallenges from '../../../../components/game/network/PerfectChallenges';

let mockProps;
beforeEach(() => {
  mockProps = {
    current: 22,
    total: 40
  };
});

test('renders the PerfectChallenges component', () => {
  const wrapper = shallow(<PerfectChallenges {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
