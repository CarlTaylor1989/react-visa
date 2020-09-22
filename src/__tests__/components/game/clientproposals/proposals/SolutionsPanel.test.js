/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  SolutionsPanel,
  mapDispatchToProps
} from '../../../../../components/game/clientproposals/proposals/SolutionsPanel';
import * as actions from '../../../../../actions/client';
import * as types from '../../../../../actions/clientTypes';
import {
  checkSolutionCorrectness,
  getNumberOfCorrectSolutions,
  getSolutionStatus
} from '../../../../../lib/clients';

jest.mock('../../../../../lib/clients');

let mockProps;
const productId = 'id';
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    answeredCorrectly: false,
    clientData: {
      id: 'client1'
    },
    displaySoluFeedback: true,
    setPromptsPaused: jest.fn(),
    setSolutionFeedback: jest.fn()
  };

  getSolutionStatus.mockImplementation(() => ({
    disabled: false,
    selected: false
  }));
});

test('renders the SolutionsPanel component', () => {
  const wrapper = shallow(<SolutionsPanel {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
  expect(wrapper.instance().timeAvailable).toBeDefined();
});

test('renders the SolutionsPanel component without the submit button', () => {
  const wrapper = shallow(<SolutionsPanel {...mockProps} answeredCorrectly />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidUpdate()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<SolutionsPanel {...mockProps} />);
    wrapper.instance().setSolutionSubmit = jest.fn();
  });

  test('solution panel is open', () => {
    wrapper.setProps({ displaySoluFeedback: true });
    expect(wrapper.instance().setSolutionSubmit).not.toHaveBeenCalled();
  });

  test('solution panel closed and submit is disabled', () => {
    // setup
    checkSolutionCorrectness.mockImplementation(() => false);
    wrapper.instance().state.products[productId].selected = false;

    // function under test
    wrapper.setProps({ displaySoluFeedback: false });

    // expectation
    expect(wrapper.instance().setSolutionSubmit).toHaveBeenCalledWith(false, expect.any(Object));
  });
});

describe('method onProductChange()', () => {
  test('select solution', () => {
    // setup
    const wrapper = shallow(<SolutionsPanel {...mockProps} />);
    wrapper.instance().state.products.irrelevant = {
      disabled: false,
      selected: true
    };

    // function under test
    wrapper.instance().onProductChange(productId);

    // expectation
    expect(wrapper.instance().state.products[productId]).toEqual(
      expect.objectContaining({
        selected: true
      })
    );
  });

  test('unselect solution', () => {
    // setup
    const wrapper = shallow(<SolutionsPanel {...mockProps} />);
    wrapper.instance().state.products[productId] = { selected: true };

    // function under test
    wrapper.instance().onProductChange(productId);

    // expectation
    expect(wrapper.instance().state.products[productId]).toEqual(
      expect.objectContaining({
        selected: false
      })
    );
  });
});

test('method onLearnMore()', () => {
  // setup
  const solution = '0';
  const wrapper = shallow(<SolutionsPanel {...mockProps} />);

  // function under test
  wrapper.instance().onLearnMore(solution);

  // expectation
  expect(wrapper.instance().state).toEqual(
    expect.objectContaining({
      displayInfo: true,
      solutionId: '0'
    })
  );
});

test('method closeInfo()', () => {
  // setup
  const wrapper = shallow(<SolutionsPanel {...mockProps} />);
  wrapper.instance().state.displayInfo = true;
  wrapper.instance().state.solutionId = '0';

  // function under test
  wrapper.instance().closeInfo();

  // expectation
  expect(wrapper.instance().state).toEqual(
    expect.objectContaining({
      displayInfo: false,
      solutionId: ''
    })
  );
});

describe('method onSubmit()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<SolutionsPanel {...mockProps} />);
    wrapper.instance().setSolutionSubmit = jest.fn();
    checkSolutionCorrectness.mockImplementation(() => true);
  });

  test('incorrect solution and not selected', () => {
    // setup
    wrapper.instance().state.products[productId].selected = false;
    getNumberOfCorrectSolutions.mockImplementation(() => 2);

    // function under test
    wrapper.instance().onSubmit();

    // expectations
    expect(wrapper.instance().setSolutionSubmit).toHaveBeenCalledWith(false, expect.any(Object));
    expect(mockProps.setSolutionFeedback).toHaveBeenCalledWith(false);
  });

  test('incorrect statement and selected', () => {
    // setup
    wrapper.instance().state.products[productId].selected = true;
    checkSolutionCorrectness.mockImplementation(() => false);
    getNumberOfCorrectSolutions.mockImplementation(() => 2);

    // function under test
    wrapper.instance().onSubmit();

    // expectations
    expect(wrapper.instance().setSolutionSubmit).toHaveBeenCalledWith(false, expect.any(Object));
    expect(mockProps.setSolutionFeedback).toHaveBeenCalledWith(false);
  });

  test('correct statement', () => {
    // setup
    wrapper.instance().state.products[productId].selected = true;
    getNumberOfCorrectSolutions.mockImplementation(() => 1);

    // function under test
    wrapper.instance().onSubmit();

    // expectations
    expect(wrapper.instance().setSolutionSubmit).toHaveBeenCalledWith(false, expect.any(Object));
    expect(mockProps.setSolutionFeedback).toHaveBeenCalledWith(true);
  });
});

test('method setSolutionSubmit()', () => {
  const wrapper = shallow(<SolutionsPanel {...mockProps} />);
  wrapper.instance().setSolutionSubmit(false, wrapper.instance().state.products);
  expect(wrapper.instance().state.canSubmit).toBeFalsy();
  expect(wrapper.instance().state.products).toEqual(expect.any(Object));
});

test('should mapDispatchToProps', () => {
  const dispatch = jest.fn();
  jest.spyOn(actions, 'setSolutionFeedback').mockReturnValue('setSolutionFeedback()');
  const props = mapDispatchToProps(dispatch);
  props.setSolutionFeedback();
  expect(dispatch).toHaveBeenCalledWith({
    type: types.SET_SOLUTION_FEEDBACK
  });
});
