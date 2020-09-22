/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  SummaryPrompt,
  mapStateToProps,
  mapDispatchToProps
} from '../../../../components/generic/prompts/SummaryPrompt';
import * as actions from '../../../../actions/score';
import * as types from '../../../../actions/scoreTypes';

jest.useFakeTimers();

let mockProps;
beforeEach(() => {
  mockProps = {
    categories: {
      achievements: 0,
      products: 1
    },
    closeSummary: jest.fn(),
    resetRunningCategories: jest.fn(),
    resetLastProductCompleted: jest.fn(),
    resetChangedAchievement: jest.fn(),
    running: 10000,
    setDisplayedScore: jest.fn(),
    setPlayAudio: jest.fn()
  };
});

test('renders the SummaryPrompt component', () => {
  const wrapper = shallow(<SummaryPrompt {...mockProps} />, {
    disableLifecycleMethods: true,
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method componentDidMount()', () => {
  // setup
  const wrapper = shallow(<SummaryPrompt {...mockProps} />, {
    disableLifecycleMethods: true,
  });
  wrapper.instance().closeSummary = jest.fn();

  // function under test
  wrapper.instance().componentDidMount();
  jest.runOnlyPendingTimers();

  // expectations
  expect(wrapper.instance().closeSummary).toHaveBeenCalled();
  expect(mockProps.setDisplayedScore).toHaveBeenCalled();
});

test('method componentWillUnmount()', () => {
  // setup
  const wrapper = shallow(<SummaryPrompt {...mockProps} />, {
    disableLifecycleMethods: true,
  });

  // function under test
  wrapper.instance().componentWillUnmount();

  // expectations
  expect(mockProps.resetRunningCategories).toHaveBeenCalled();
  expect(mockProps.resetLastProductCompleted).toHaveBeenCalled();
  expect(mockProps.resetChangedAchievement).toHaveBeenCalled();
});

test('method closeSummary()', () => {
  const wrapper = shallow(<SummaryPrompt {...mockProps} />, {
    disableLifecycleMethods: true,
  });
  wrapper.instance().closeSummary();
  expect(mockProps.closeSummary).toHaveBeenCalled();
});

test('should mapStateToProps', () => {
  // setup
  const state = {
    scoreData: {
      categories: {
        foo: 0,
        bar: 1
      },
      running: 15000
    }
  };
  const expected = {
    ...state.scoreData
  };

  // function under test
  const props = mapStateToProps(state);

  // expectation
  expect(props).toEqual(expected);
});

test('should mapDispatchToProps', () => {
  const dispatch = jest.fn();
  jest.spyOn(actions, 'resetRunningCategories').mockReturnValue('resetRunningCategories()');
  const props = mapDispatchToProps(dispatch);
  props.resetRunningCategories();
  expect(dispatch).toHaveBeenCalledWith({
    type: types.RESET_RUNNING_CATEGORIES
  });
});
