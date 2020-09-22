/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  Achievements,
  mapStateToProps
} from '../../../../components/generic/minidashboard/Achievements';

test('render Achievements component with the default text', () => {
  const wrapper = shallow(<Achievements lastCompleted="" />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('render Achievements component with an achievement', () => {
  const wrapper = shallow(<Achievements lastCompleted="ac1" />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('should mapStateToProps', () => {
  const state = {
    achievementsData: {
      completed: ['ac1'],
      lastCompleted: 'ac1'
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    lastCompleted: state.achievementsData.lastCompleted,
  });
});
