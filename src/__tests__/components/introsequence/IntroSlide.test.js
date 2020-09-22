/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import IntroSlide from '../../../components/introsequence/IntroSlide';

let mockProps;
beforeEach(() => {
  mockProps = {
    title: 'irrelevant',
    text: 'irrelevant'
  };
});

test('renders the IntroSlide component', () => {
  const wrapper = shallow(<IntroSlide {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
