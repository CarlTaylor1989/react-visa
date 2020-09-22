/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import IframePopupFailed from '../../../../components/generic/iframepopup/IframePopupFailed';

test('renders the IframePopupFailed component', () => {
  const wrapper = shallow(<IframePopupFailed />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
