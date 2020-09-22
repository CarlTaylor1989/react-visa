/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ClientProposals from '../../../../components/game/clientproposals/ClientProposals';
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

test('renders the ClientProposals component', () => {
  const wrapper = shallow(<ClientProposals {...mockProps} />);
  expect(
    toJson(wrapper, {
      noKey: false,
      map: wrapper.exists('CSSTransition') && removeCSSTransitionKey
    })
  ).toMatchSnapshot();
});
