/* global toJson */
import React from 'react';
import ShowSolutionPrompt from
  '../../../../../../components/game/clientproposals/proposals/solutionfeedback/ShowSolutionPrompt';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    client: 'client1',
    showPrompt: false,
    closePrompt: jest.fn(),
    onGiveUp: jest.fn()
  };
});

test('renders the ShowSolutionPrompt component', () => {
  const wrapper = shallow(<ShowSolutionPrompt {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
