/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ResourceInlineSVG from
  '../../../../../../components/game/clientproposals/proposals/resources/ResourceInlineSVG';

let mockProps;
beforeEach(() => {
  mockProps = {
    client: 'client1',
    imageName: 'client1_resource_avatar_1.svg',
    type: 'irrelevant'
  };
});

test('renders the ResourceInlineSVG component', () => {
  const wrapper = shallow(<ResourceInlineSVG {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
