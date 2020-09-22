/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  ExitGame,
  mapDispatchToProps
} from '../../../../components/generic/exitgame/ExitGame';
import * as hintActions from '../../../../actions/hints';
import * as hintTypes from '../../../../actions/hintsTypes';

jest.useFakeTimers();

let mockProps;

beforeEach(() => {
  mockProps = {
    closePopup: jest.fn(),
    exitGame: jest.fn(),
    setHintsPaused: jest.fn(),
    showPopup: false
  };
});

test('renders a closed popup', () => {
  const wrapper = shallow(<ExitGame {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders an open popup', () => {
  const wrapper = shallow(<ExitGame {...mockProps} showPopup />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidUpdate()', () => {
  test('popup about to show - pause hints', () => {
    const wrapper = shallow(<ExitGame {...mockProps} />);
    wrapper.setProps({ showPopup: true });
    wrapper.update();
    expect(mockProps.setHintsPaused).toHaveBeenCalledWith(true);
  });

  test('popup is still displayed', () => {
    const wrapper = shallow(<ExitGame {...mockProps} showPopup />);
    wrapper.setProps({ showPopup: true });
    wrapper.update();
    expect(mockProps.setHintsPaused).not.toHaveBeenCalled();
  });
});

test('method onPopupExit()', () => {
  const wrapper = shallow(<ExitGame {...mockProps} />);
  wrapper.instance().onPopupExit();
  expect(mockProps.setHintsPaused).toHaveBeenCalledWith(false);
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
