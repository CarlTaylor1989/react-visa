/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import Network from '../../../../components/game/network/Network';
import removeCSSTransitionKey from '../../../../lib/removeCSSTransitionKey';

let mockProps;
beforeEach(() => {
  mockProps = {
    location: {
      hash: '',
      key: '',
      pathname: '',
      search: ''
    }
  };
});

test('renders the Network component', () => {
  const wrapper = shallow(<Network {...mockProps} />);
  expect(
    toJson(wrapper, {
      noKey: false,
      map: wrapper.exists('CSSTransition') && removeCSSTransitionKey
    })
  ).toMatchSnapshot();
});
