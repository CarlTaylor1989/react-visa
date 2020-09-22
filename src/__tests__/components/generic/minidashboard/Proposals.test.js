/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  Proposals,
  mapStateToProps
} from '../../../../components/generic/minidashboard/Proposals';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    wins: 2,
    losses: 26
  };
});

test('renders the Proposals component', () => {
  const wrapper = shallow(<Proposals {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('should mapStateToProps', () => {
  // setup
  const state = {
    clientProposalData: {
      clients: [
        {
          proposalCompleted: true,
          status: 2
        },
        {
          proposalCompleted: true,
          status: 2
        },
        {
          proposalCompleted: true,
          status: 4
        }
      ]
    }
  };

  const expected = {
    wins: 2,
    losses: 1
  };

  // function under test
  const props = mapStateToProps(state);

  // expectation
  expect(props).toEqual(expected);
});
