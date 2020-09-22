/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import MapText from '../../../../components/game/network/MapText';

let mockProps;
beforeEach(() => {
  mockProps = {
    nameCoord: {
      name: 'irrelevant',
      coordinates: [100, 100]
    },
    type: 'type'
  };
});

test('renders the MapText component', () => {
  const wrapper = shallow(<MapText {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
