/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ResourceIcon from
  '../../../../../../components/game/clientproposals/proposals/resources/ResourceIcon';

let mockProps;
beforeEach(() => {
  mockProps = {
    type: ''
  };
});

test('renders the ResourceIcon component', () => {
  const wrapper = shallow(<ResourceIcon {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ResourceIcon component with audio type ', () => {
  const wrapper = shallow(<ResourceIcon {...mockProps} type="audio" />);
  expect(wrapper.hasClass('audio')).toBe(true);
});

test('renders the ResourceIcon component with call type ', () => {
  const wrapper = shallow(<ResourceIcon {...mockProps} type="call" />);
  expect(wrapper.hasClass('call')).toBe(true);
});

test('renders the ResourceIcon component with email type ', () => {
  const wrapper = shallow(<ResourceIcon {...mockProps} type="email" />);
  expect(wrapper.hasClass('email')).toBe(true);
});

test('renders the ResourceIcon component with pdf type ', () => {
  const wrapper = shallow(<ResourceIcon {...mockProps} type="pdf" />);
  expect(wrapper.hasClass('pdf')).toBe(true);
});

test('renders the ResourceIcon component with video type ', () => {
  const wrapper = shallow(<ResourceIcon {...mockProps} type="video" />);
  expect(wrapper.hasClass('video')).toBe(true);
});
