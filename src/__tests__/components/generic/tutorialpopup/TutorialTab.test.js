/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import TutorialTab from '../../../../components/generic/tutorialpopup/TutorialTab';

let mockProps;
beforeEach(() => {
  mockProps = {
    label: 'irrelevant',
    onTabSelect: jest.fn(),
    slideIndex: 0,
    sectionIndices: [0, 2]
  };
});

test('renders the TutorialTab component with a selected button', () => {
  const wrapper = shallow(<TutorialTab {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the TutorialTab component with an unselected button', () => {
  const wrapper = shallow(<TutorialTab {...mockProps} slideIndex={4} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method onTabSelect()', () => {
  const wrapper = shallow(<TutorialTab {...mockProps} />);
  wrapper.instance().onTabSelect();
  expect(mockProps.onTabSelect).toHaveBeenCalledWith(expect.any(Number));
});
