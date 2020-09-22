/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import RequirementFeedback from
  '../../../../../components/game/clientproposals/proposals/RequirementFeedback';
import { REQUIREMENT_MAX_ATTEMPTS } from '../../../../../config/clients';
import { getRemainingAttempts } from '../../../../../lib/clients';

jest.mock('../../../../../lib/clients');

let mockGenericProps;
beforeEach(() => {
  mockGenericProps = {
    onAnswerCorrectly: jest.fn(),
    onRetry: jest.fn(),
    onLocked: jest.fn(),
    onLockClient: jest.fn(),
    points: 10000
  };
  getRemainingAttempts.mockImplementation(() => 1);
});

test('renders the RequirementFeedback component without any feedback', () => {
  const mockProps = {
    ...mockGenericProps,
    clientData: {},
    showFeedback: false
  };
  const wrapper = shallow(<RequirementFeedback {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidUpdate()', () => {
  test('feedback displayed and client is locked', () => {
    // setup
    const mockProps = {
      ...mockGenericProps,
      clientData: { reqAttempts: REQUIREMENT_MAX_ATTEMPTS },
      showFeedback: false
    };
    const wrapper = shallow(<RequirementFeedback {...mockProps} />);

    // function under test
    wrapper.setProps({
      showFeedback: true
    });

    // expectation
    expect(mockProps.onLockClient).toHaveBeenCalled();
  });

  test('feedback displayed and client is not locked', () => {
    // setup
    const mockProps = {
      ...mockGenericProps,
      clientData: { reqAttempts: 1 },
      showFeedback: false
    };
    const wrapper = shallow(<RequirementFeedback {...mockProps} />);

    // function under test
    wrapper.setProps({
      showFeedback: true
    });

    // expectation
    expect(mockProps.onLockClient).not.toHaveBeenCalled();
  });

  test('feedback is hidden', () => {
    // setup
    const mockProps = {
      ...mockGenericProps,
      clientData: { reqAttempts: 1 },
      showFeedback: true
    };
    const wrapper = shallow(<RequirementFeedback {...mockProps} />);

    // function under test
    wrapper.setProps({
      showFeedback: false
    });

    // expectation
    expect(mockProps.onLockClient).not.toHaveBeenCalled();
  });
});

test('renders the RequirementFeedback component with the correct feedback and an OK button', () => {
  const mockProps = {
    ...mockGenericProps,
    clientData: {
      id: 'client1',
      reqAttempts: 1,
      reqCorrect: true
    },
    showFeedback: true
  };
  const wrapper = shallow(<RequirementFeedback {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the RequirementFeedback component with the incorrect feedback and a retry button', () => { // eslint-disable-line max-len
  const mockProps = {
    ...mockGenericProps,
    clientData: {
      id: 'client1',
      reqAttempts: 1,
      reqCorrect: false
    },
    showFeedback: true
  };
  const wrapper = shallow(<RequirementFeedback {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the RequirementFeedback component with the incorrect feedback with an OK button', () => { // eslint-disable-line max-len
  const mockProps = {
    ...mockGenericProps,
    clientData: {
      id: 'client1',
      reqAttempts: REQUIREMENT_MAX_ATTEMPTS,
      reqCorrect: false
    },
    showFeedback: true
  };
  const wrapper = shallow(<RequirementFeedback {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
