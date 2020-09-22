/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import { ChallengeIcon, mapStateToProps } from '../../../../components/game/network/ChallengeIcon';
import {
  CHALLENGE_PERFECT_STATUS,
  CHALLENGE_COMPLETION_STATUS,
  CHALLENGE_AVAILABLE_STATUS,
  CHALLENGE_UNAVAILABLE_STATUS
} from '../../../../config/constants';


let mockProps;
beforeEach(() => {
  mockProps = {
    challenges: [],
    challengeId: 'c1',
    coordinates: [100, 100],
    familyId: 'm1f1',
    lastChallengesModified: [],
    currentProduct: '',
    mapInitialised: false
  };
});

test('renders the ChallengeIcon component with the available state', () => {
  const wrapper = shallow(<ChallengeIcon {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method componentDidUpdate()', () => {
  const wrapper = shallow(<ChallengeIcon {...mockProps} />);
  wrapper.instance().updateChallengeState = jest.fn();
  wrapper.setProps({
    lastChallengesModified: ['c1', 'c2']
  });
  wrapper.update();
  expect(wrapper.instance().updateChallengeState).toHaveBeenCalled();
});

describe('method updateChallengeState()', () => {
  test('sets the status to completed', () => {
    const challenges = [{
      id: 'c1',
      familyId: 'm1f1',
      status: CHALLENGE_COMPLETION_STATUS
    }];
    const wrapper = shallow(<ChallengeIcon {...mockProps} challenges={challenges} />);
    wrapper.instance().updateChallengeState();
    expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
    expect(wrapper.instance().state.status).toBe('completed');
  });

  test('sets the status to perfect', () => {
    const challenges = [{
      id: 'c1',
      familyId: 'm1f1',
      status: CHALLENGE_PERFECT_STATUS
    }];
    const wrapper = shallow(<ChallengeIcon {...mockProps} challenges={challenges} />);
    wrapper.instance().updateChallengeState();
    expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
    expect(wrapper.instance().state.status).toBe('perfect');
  });

  test('sets the status to available', () => {
    const challenges = [{
      id: 'c1',
      familyId: 'm1f1',
      status: CHALLENGE_AVAILABLE_STATUS
    }];
    const wrapper = shallow(<ChallengeIcon {...mockProps} challenges={challenges} />);
    wrapper.instance().updateChallengeState();
    expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
    expect(wrapper.instance().state.status).toBe('available');
  });

  test('sets the status to available for the first tree node', () => {
    const challenges = [{
      id: 'c1',
      familyId: 'm1f1',
      status: CHALLENGE_UNAVAILABLE_STATUS,
      isFirst: true
    }];
    const wrapper = shallow(<ChallengeIcon {...mockProps} challenges={challenges} />);
    wrapper.instance().updateChallengeState();
    expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
    expect(wrapper.instance().state.status).toBe('available');
  });
});

test('should mapStateToProps', () => {
  const state = {
    mapData: {
      challenges: [],
      initialised: false,
      lastChallengesModified: []
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    challenges: [],
    mapInitialised: false,
    lastChallengesModified: []
  });
});
