/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import GetStarted from '../../../../components/game/clientproposals/GetStarted';

test('renders the GetStarted component', () => {
  const wrapper = shallow(<GetStarted />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
