/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import TutorialSlide from '../../../../components/generic/tutorialpopup/TutorialSlide';

let mockProps;
beforeEach(() => {
  mockProps = {
    imageSrc: 'foo.png',
    text: '',
    title: ''
  };
});

test('renders the TutorialSlide component with just a title', () => {
  const wrapper = shallow(<TutorialSlide {...mockProps} title="irrelevant" />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the TutorialSlide component with just some text', () => {
  const wrapper = shallow(<TutorialSlide {...mockProps} text="irrelevant" />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
