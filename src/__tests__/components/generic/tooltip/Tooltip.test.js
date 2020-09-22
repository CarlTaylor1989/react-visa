/* global toJson */
import React from 'react';
import {
  Tooltip,
  mapStateToProps
} from '../../../../components/generic/tooltip/Tooltip';

let mockProps;
beforeEach(() => {
  mockProps = {
    children: 'irrelevant',
    fieldName: 'generic.tooltips.settings.audio',
    enabled: false,
    textProps: {
      score: 3
    }
  };
});

test('renders a disabled Tooltip', () => {
  const wrapper = shallow(<Tooltip {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders an enabled Tooltip', () => {
  const wrapper = shallow(<Tooltip {...mockProps} enabled />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('cannot render a Tooltip', () => {
  const wrapper = shallow(<Tooltip {...mockProps} forceHidden />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('should mapStateToProps', () => {
  // setup
  const state = {
    settingsData: {
      tooltips: false
    }
  };
  const expected = {
    enabled: state.settingsData.tooltips
  };

  // function under test
  const props = mapStateToProps(state);

  // expectation
  expect(props).toEqual(expected);
});
