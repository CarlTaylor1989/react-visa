/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  Points,
  mapStateToProps,
  mapDispatchToProps
} from '../../../../components/generic/minidashboard/Points';
import * as actions from '../../../../actions/score';
import * as types from '../../../../actions/scoreTypes';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    displayedScore: 0,
    scoreToDisplay: 10000,
    total: 10000,
    updateDisplayedScore: jest.fn()
  };
});

test('renders the Points component with a formatted total score', () => {
  const wrapper = shallow(<Points {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the Points component with the countup component', () => {
  const wrapper = shallow(<Points {...mockProps} animate />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidUpdate()', () => {
  test('score updated', () => {
    // setup
    const wrapper = shallow(<Points {...mockProps} />);
    wrapper.instance().setScores = jest.fn();
    wrapper.setProps({ scoreToDisplay: 1000 });

    // function under test
    wrapper.update();

    // expectation
    expect(wrapper.instance().setScores).toHaveBeenCalled();
  });

  test('score remained the same', () => {
    // setup
    const wrapper = shallow(<Points {...mockProps} />);
    wrapper.instance().setScores = jest.fn();

    // function under test
    wrapper.update();

    // expectation
    expect(wrapper.instance().setScores).not.toHaveBeenCalled();
  });
});

test('method onAnimationEnded()', () => {
  const wrapper = shallow(<Points {...mockProps} />);
  wrapper.instance().onAnimationEnded();
  expect(mockProps.updateDisplayedScore).toHaveBeenCalled();
});

test('method setScores()', () => {
  // setup
  const wrapper = shallow(<Points {...mockProps} />);

  // function under test
  wrapper.instance().setScores();

  // expectations
  expect(wrapper.instance().state.startScore).toEqual(mockProps.displayedScore);
  expect(wrapper.instance().state.endScore).toEqual(mockProps.scoreToDisplay);
});

test('should mapStateToProps', () => {
  const state = {
    scoreData: {
      displayedScore: 100,
      scoreToDisplay: 100
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    ...state.scoreData
  });
});

test('calls addTutorialToQueue', () => {
  const dispatch = jest.fn();
  jest.spyOn(actions, 'updateDisplayedScore').mockReturnValue('updateDisplayedScore()');
  const props = mapDispatchToProps(dispatch);
  props.updateDisplayedScore();
  expect(dispatch).toHaveBeenCalledWith({
    type: types.UPDATE_DISPLAYED_SCORE
  });
});
