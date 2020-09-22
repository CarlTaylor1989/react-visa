/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ResourcePopup from
  '../../../../../../components/game/clientproposals/proposals/resources/ResourcePopup';

let mockProps;
beforeEach(() => {
  mockProps = {
    showPopup: true,
    client: 'client1',
    closePopup: jest.fn(),
    type: '',
    resources: {
      0: {
        id: 'res1',
        name: 'RESOURCE NAME',
        text: 'TEXT',
        type: 'pdf',
        url: 'url'
      }
    },
    resourceId: 'res1'
  };
});

test('renders a hidden ResourcePopup component', () => {
  const wrapper = shallow(<ResourcePopup {...mockProps} showPopup={false} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders a displayed ResourcePopup component', () => {
  const wrapper = shallow(<ResourcePopup {...mockProps} />);
  expect(wrapper.find('ResourceIcon').exists()).toBe(true);
});
