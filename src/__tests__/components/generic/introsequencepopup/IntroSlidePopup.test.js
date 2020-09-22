/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import IntroSlidePopup from '../../../../components/generic/introsequencepopup/IntroSlidePopup';

test('renders the IntroSlidePopup component', () => {
  const wrapper = shallow(<IntroSlidePopup text="irrelevant" />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
