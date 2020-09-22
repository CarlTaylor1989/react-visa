/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import Arrows from '../../../../components/generic/arrows/Arrows';

test('renders the Arrows component', () => {
  const wrapper = shallow(<Arrows />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders in bottom direction by default', () => {
  const wrapper = shallow(<Arrows />);
  expect(wrapper.find('.arrows').hasClass('bottom')).toEqual(true);
});

test('renders in top direction', () => {
  const wrapper = shallow(<Arrows direction="top" />);
  expect(wrapper.find('.arrows').hasClass('top')).toEqual(true);
});

test('renders in right direction', () => {
  const wrapper = shallow(<Arrows direction="right" />);
  expect(wrapper.find('.arrows').hasClass('right')).toEqual(true);
});

test('renders in bottom direction', () => {
  const wrapper = shallow(<Arrows direction="bottom" />);
  expect(wrapper.find('.arrows').hasClass('bottom')).toEqual(true);
});

test('renders in left direction', () => {
  const wrapper = shallow(<Arrows direction="left" />);
  expect(wrapper.find('.arrows').hasClass('left')).toEqual(true);
});
