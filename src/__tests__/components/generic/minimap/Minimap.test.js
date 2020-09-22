/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import Minimap from '../../../../components/generic/minimap/Minimap';

test('renders the Minimap component', () => {
  const wrapper = shallow(<Minimap />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
