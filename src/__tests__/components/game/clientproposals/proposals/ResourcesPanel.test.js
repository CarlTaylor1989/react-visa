/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import { I18n } from 'react-redux-i18n';
import ResourcesPanel from
  '../../../../../components/game/clientproposals/proposals/ResourcesPanel';

I18n.t = jest.fn((location) => {
  if (location.match(/resources$/)) {
    return {
      0: {
        id: 'res1',
        name: 'RESOURCE NAME',
        text: 'TEXT',
        type: 'pdf',
        url: 'url'
      },
      1: {
        id: 'res2',
        name: 'RESOURCE NAME',
        text: 'TEXT',
        type: 'video',
        url: 'url'
      },
      2: {
        id: 'res3',
        name: 'RESOURCE NAME',
        text: 'TEXT',
        type: 'audio',
        url: 'url'
      }
    };
  }

  if (location.match(/id$/)) {
    return 'res1';
  }

  if (location.match(/type$/)) {
    return 'report';
  }

  return '';
});

let mockProps;
beforeEach(() => {
  mockProps = {
    client: 'client1',
    isResourcePopupOpen: false,
    selectedResourceType: 'type',
    selectedResourceId: 'id',
    onOpenResourcePopup: jest.fn(),
    onCloseResourcePopup: jest.fn(),
  };
});

test('renders the ResourcesPanel component', () => {
  const wrapper = shallow(<ResourcesPanel {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
