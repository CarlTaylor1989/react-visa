/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import AchievementRow from '../../../../components/generic/dashboard/AchievementRow';

let mockProps;
beforeEach(() => {
  mockProps = {
    achievementId: 'ac1',
    complete: false,
    completion: {
      percent: 50,
      amount: 5000,
      total: 10000
    },
    hidden: false,
    score: 10000
  };
});

test('renders the AchievementRow component with an incomplete achievement', () => {
  const wrapper = shallow(<AchievementRow {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the AchievementRow component with a incomplete achievement', () => {
  const wrapper = shallow(<AchievementRow {...mockProps} complete />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the AchievementRow component with a hidden achievement', () => {
  const wrapper = shallow(<AchievementRow {...mockProps} hidden />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
