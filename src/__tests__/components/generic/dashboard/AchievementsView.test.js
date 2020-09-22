/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  AchievementsView,
  mapStateToProps
} from '../../../../components/generic/dashboard/AchievementsView';
import { getUserAchievementData } from '../../../../lib/achievements';
import { sendInteractionData } from '../../../../tracking/xapi/XApiAdapter';

jest.mock('../../../../tracking/xapi/XApiAdapter');

jest.mock('../../../../lib/achievements');

let mockProps;
beforeEach(() => {
  mockProps = {
    challenges: [{ isFinal: false }],
    clients: [],
    completedAchievements: ['ac1'],
    noOfConsecutiveDays: 0,
    noOfCompletedChallenges: 0,
    noOfCompletedProducts: 0,
    noOfPerfectChallenges: 0,
    totalScore: 1000
  };
  getUserAchievementData.mockImplementation(() => ([{
    id: 'irrelevant',
    completion: {
      complete: false,
      completedPercent: 0,
      completedAmount: 1,
      totalAmount: 10
    },
    hidden: false,
    score: 5000
  }]));
});

test('renders the AchievementsView component', () => {
  const wrapper = shallow(<AchievementsView {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method componentWillUnmount()', () => {
  const wrapper = shallow(<AchievementsView {...mockProps} />);
  wrapper.instance().componentWillUnmount();
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'experienced',
    activity: expect.objectContaining({
      id: expect.stringContaining('achievements'),
      type: 'slide',
      title: expect.any(String),
      description: expect.any(String)
    }),
    response: expect.objectContaining({
      timeAvailable: expect.any(Date),
      timeResponse: expect.any(Date)
    }),
    parent: expect.any(String)
  }));
});

test('should mapStateToProps', () => {
  // setup
  const state = {
    achievementsData: {
      completed: []
    },
    clientProposalData: {
      clients: []
    },
    genericData: {
      consecutive: 0
    },
    mapData: {
      challenges: [],
      completedChallenges: [],
      completedProducts: [],
      perfect: []
    },
    scoreData: {
      total: 1000
    }
  };
  const expected = {
    ...state.clientProposalData,
    challenges: state.mapData.challenges,
    completedAchievements: state.achievementsData.completed,
    noOfConsecutiveDays: state.genericData.consecutive,
    noOfCompletedChallenges: state.mapData.completedChallenges.length,
    noOfCompletedProducts: state.mapData.completedProducts.length,
    noOfPerfectChallenges: state.mapData.perfect.length,
    totalScore: state.scoreData.total
  };

  // function under test
  const props = mapStateToProps(state);

  // expectation
  expect(props).toEqual(expected);
});
