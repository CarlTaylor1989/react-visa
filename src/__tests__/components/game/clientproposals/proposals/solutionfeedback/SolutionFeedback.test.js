/* global toJson */
import React from 'react';
import SolutionFeedback from
  '../../../../../../components/game/clientproposals/proposals/solutionfeedback/SolutionFeedback';

let mockGenericProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockGenericProps = {
    closePopup: jest.fn(),
    onAnswerCorrectly: jest.fn(),
    onModalExited: jest.fn(),
    onModalOpen: jest.fn(),
    showPopup: true,
    setClientStatus: jest.fn(),
    setProposalAsComplete: jest.fn()
  };
});

test('renders the SolutionFeedback component without any feedback', () => {
  const mockProps = {
    ...mockGenericProps,
    clientData: {},
    showPopup: false
  };
  const wrapper = shallow(<SolutionFeedback {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the SolutionFeedback component with the correct feedback and an OK button', () => {
  const mockProps = {
    ...mockGenericProps,
    clientData: {
      id: 'client1',
      solutionAttempts: 1,
      solutionCorrect: true,
      solutionScore: 100000
    },
    onModalExited: jest.fn(),
    onModalOpen: jest.fn(),
    showPopup: true
  };
  const wrapper = shallow(<SolutionFeedback {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the SolutionFeedback component with the incorrect feedback', () => {
  const mockProps = {
    ...mockGenericProps,
    clientData: {
      id: 'client1',
      solutionAttempts: 1,
      solutionCorrect: false,
      solutionScore: 100000
    },
    showFeedback: true
  };
  const wrapper = shallow(<SolutionFeedback {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the SolutionFeedback component with the given up feedback', () => {
  const mockProps = {
    ...mockGenericProps,
    clientData: {
      id: 'client1',
      solutionAttempts: 1,
      solutionCorrect: false,
      solutionScore: 0,
      status: 4
    },
    showFeedback: true
  };
  const wrapper = shallow(<SolutionFeedback {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method componentWillUnmount()', () => {
  // setup
  const mockProps = {
    ...mockGenericProps,
    clientData: {
      id: 'client1',
      solutionScore: 100000
    }
  };
  const wrapper = shallow(<SolutionFeedback {...mockProps} />);

  // function under test
  wrapper.unmount();

  // expectation
  expect(mockProps.onModalExited).toHaveBeenCalled();
});

test('method onOpenPrompt()', () => {
  // setup
  const mockProps = {
    ...mockGenericProps,
    clientData: {
      id: 'client1',
      solutionScore: 100000
    }
  };
  const wrapper = shallow(<SolutionFeedback {...mockProps} />);
  wrapper.instance().state.showPrompt = false;

  // function under test
  wrapper.instance().onOpenPrompt();

  // expectation
  expect(wrapper.instance().state.showPrompt).toBe(true);
});

test('method onClosePrompt()', () => {
  // setup
  const mockProps = {
    ...mockGenericProps,
    clientData: {
      id: 'client1',
      solutionScore: 100000
    }
  };
  const wrapper = shallow(<SolutionFeedback {...mockProps} />);
  wrapper.instance().state.showPrompt = true;

  // function under test
  wrapper.instance().onClosePrompt();

  // expectation
  expect(wrapper.instance().state.showPrompt).toBe(false);
});

test('method onGiveUp()', () => {
  // setup
  const mockProps = {
    ...mockGenericProps,
    clientData: {
      id: 'client1',
      solutionScore: 100000
    }
  };
  const wrapper = shallow(<SolutionFeedback {...mockProps} />);

  // function under test
  wrapper.instance().onGiveUp();

  // expectation
  expect(mockProps.setClientStatus).toHaveBeenCalledWith('client1', 4);
});
