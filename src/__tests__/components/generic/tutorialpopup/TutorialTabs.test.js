/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import TutorialTabs from '../../../../components/generic/tutorialpopup/TutorialTabs';

let mockProps;
beforeEach(() => {
  mockProps = {
    setSlideIndex: jest.fn(),
    slideIndex: 0
  };
});

test('renders the TutorialTabs component', () => {
  const wrapper = shallow(<TutorialTabs {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
