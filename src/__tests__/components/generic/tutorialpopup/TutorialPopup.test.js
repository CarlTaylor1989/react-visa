/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  TutorialPopup,
  mapStateToProps,
  mapDispatchToProps
} from '../../../../components/generic/tutorialpopup/TutorialPopup';
import * as hintActions from '../../../../actions/hints';
import * as hintTypes from '../../../../actions/hintsTypes';

let mockProps;
beforeEach(() => {
  mockProps = {
    closePopup: jest.fn(),
    setHintsPaused: jest.fn(),
    setTutorialSlideIndex: jest.fn(),
    showPopup: true,
    slideIndex: 0
  };
});

test('renders a closed TutorialPopup popup', () => {
  const wrapper = shallow(<TutorialPopup {...mockProps} showPopup={false} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders an open TutorialPopup popup', () => {
  const wrapper = shallow(<TutorialPopup {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidUpdate()', () => {
  test('calls the setHintsPaused() method', () => {
    const wrapper = shallow(<TutorialPopup {...mockProps} showPopup={false} />);
    wrapper.setProps({
      showPopup: true
    });
    expect(mockProps.setHintsPaused).toHaveBeenCalledWith(true);
  });

  test('does not call the setHintsPaused() method', () => {
    const wrapper = shallow(<TutorialPopup {...mockProps} />);
    wrapper.setProps({
      showPopup: false
    });
    expect(mockProps.setHintsPaused).not.toHaveBeenCalled();
  });
});

test('method onPopupExit()', () => {
  const wrapper = shallow(<TutorialPopup {...mockProps} />);
  wrapper.instance().onPopupExit();
  expect(mockProps.setHintsPaused).toHaveBeenCalledWith(false);
});

test('should mapStateToProps', () => {
  // setup
  const state = {
    tutorialData: {
      slideIndex: 1
    }
  };
  const expected = {
    ...state.tutorialData
  };

  // function under test
  const props = mapStateToProps(state);

  // expectation
  expect(props).toEqual(expected);
});

describe('should mapDispatchToProps', () => {
  test('SET_HINTS_PAUSED', () => {
    const dispatch = jest.fn();
    jest.spyOn(hintActions, 'setHintsPaused').mockReturnValue('setHintsPaused()');
    const props = mapDispatchToProps(dispatch);
    props.setHintsPaused();
    expect(dispatch).toHaveBeenCalledWith({
      type: hintTypes.SET_HINTS_PAUSED
    });
  });
});
