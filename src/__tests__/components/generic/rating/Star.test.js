/* global toJson */
import React from 'react';
import Star from '../../../../components/generic/rating/Star';

test('renders the Star component with only the default class', () => {
  const wrapper = shallow(<Star active={false} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the Star component with the active class', () => {
  const wrapper = shallow(<Star active />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
