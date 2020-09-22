/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  Requirements,
  mapDispatchToProps
} from '../../../../../components/game/clientproposals/proposals/Requirements';
import * as actions from '../../../../../actions/client';
import * as types from '../../../../../actions/clientTypes';
import {
  checkStatementCorrectness,
  getNumberOfCorrectStatements,
  getStatementStatus,
  getRequirementStatements,
  getRequirementStatementIds
} from '../../../../../lib/clients';

jest.mock('../../../../../lib/clients');

let mockProps;
const statementId = 'stm1';
beforeEach(() => {
  mockProps = {
    answeredCorrectly: false,
    client: 'client1',
    setRequirementFeedback: jest.fn(),
    displayReqFeedback: true,
    closeResourcePopup: jest.fn()
  };

  getStatementStatus.mockImplementation(() => ({
    disabled: false,
    selected: false
  }));

  getRequirementStatementIds.mockImplementation(() => [statementId]);

  getRequirementStatements.mockImplementation(() => ([{
    id: statementId,
    text: 'irrelevant',
    type: 'opportunities'
  }]));
});

test('renders the Requirements component with the submit button', () => {
  const wrapper = shallow(<Requirements {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
  expect(wrapper.instance().timeAvailable).toBeDefined();
});

test('renders the Requirements component without the submit button', () => {
  const wrapper = shallow(<Requirements {...mockProps} answeredCorrectly />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidUpdate()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Requirements {...mockProps} />);
    wrapper.instance().setCheckboxesSubmit = jest.fn();
  });

  test('feedback panel is still open', () => {
    wrapper.setProps({ displayReqFeedback: true });
    expect(wrapper.instance().setCheckboxesSubmit).not.toHaveBeenCalled();
  });

  test('feedback panel closed and submit is enabled', () => {
    // setup
    checkStatementCorrectness.mockImplementation(() => true);
    wrapper.instance().state.checkboxes[statementId].selected = true;

    // function under test
    wrapper.setProps({ displayReqFeedback: false });

    // expectation
    expect(wrapper.instance().setCheckboxesSubmit).toHaveBeenCalledWith(true, expect.any(Object));
  });

  test('feedback panel closed and submit is disabled', () => {
    // setup
    checkStatementCorrectness.mockImplementation(() => false);
    wrapper.instance().state.checkboxes[statementId].selected = true;

    // function under test
    wrapper.setProps({ displayReqFeedback: false });

    // expectation
    expect(wrapper.instance().setCheckboxesSubmit).toHaveBeenCalledWith(false, expect.any(Object));
  });
});

describe('method onCheckboxChange()', () => {
  test('select statement', () => {
    // setup
    const wrapper = shallow(<Requirements {...mockProps} />);

    // function under test
    wrapper.instance().onCheckboxChange(statementId);

    // expectation
    expect(wrapper.instance().state.checkboxes[statementId]).toEqual(
      expect.objectContaining({
        selected: true
      })
    );
  });

  test('unselect statement', () => {
    // setup
    const checkboxStatementId = 'irrelevant';
    const wrapper = shallow(<Requirements {...mockProps} />);
    wrapper.instance().state.checkboxes[checkboxStatementId] = { selected: true };

    // function under test
    wrapper.instance().onCheckboxChange(checkboxStatementId);

    // expectation
    expect(wrapper.instance().state.checkboxes[checkboxStatementId]).toEqual(
      expect.objectContaining({
        selected: false
      })
    );
  });
});

describe('method onSubmit()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Requirements {...mockProps} />);
    wrapper.instance().setCheckboxesSubmit = jest.fn();
    checkStatementCorrectness.mockImplementation(() => true);
  });

  test('incorrect statement and not selected', () => {
    // setup
    wrapper.instance().state.checkboxes[statementId].selected = false;
    getNumberOfCorrectStatements.mockImplementation(() => 2);

    // function under test
    wrapper.instance().onSubmit();

    // expectations
    expect(wrapper.instance().setCheckboxesSubmit).toHaveBeenCalledWith(false, expect.any(Object));
    expect(mockProps.setRequirementFeedback).toHaveBeenCalledWith(false);
  });

  test('incorrect statement and selected', () => {
    // setup
    wrapper.instance().state.checkboxes[statementId].selected = true;
    checkStatementCorrectness.mockImplementation(() => false);
    getNumberOfCorrectStatements.mockImplementation(() => 2);

    // function under test
    wrapper.instance().onSubmit();

    // expectations
    expect(wrapper.instance().setCheckboxesSubmit).toHaveBeenCalledWith(false, expect.any(Object));
    expect(mockProps.setRequirementFeedback).toHaveBeenCalledWith(false);
  });

  test('correct statement', () => {
    // setup
    wrapper.instance().state.checkboxes[statementId].selected = true;
    getNumberOfCorrectStatements.mockImplementation(() => 1);

    // function under test
    wrapper.instance().onSubmit();

    // expectations
    expect(wrapper.instance().setCheckboxesSubmit).toHaveBeenCalledWith(false, expect.any(Object));
    expect(mockProps.setRequirementFeedback).toHaveBeenCalledWith(true);
  });
});

test('method setCheckboxesSubmit()', () => {
  const wrapper = shallow(<Requirements {...mockProps} />);
  wrapper.instance().setCheckboxesSubmit(false, wrapper.instance().state.checkboxes);
  expect(wrapper.instance().state.canSubmit).toBeFalsy();
  expect(wrapper.instance().state.checkboxes).toEqual(expect.any(Object));
});

test('should mapDispatchToProps', () => {
  const correct = false;
  const dispatch = jest.fn();
  jest.spyOn(actions, 'setRequirementFeedback').mockReturnValue('setRequirementFeedback()');
  const props = mapDispatchToProps(dispatch);
  props.setRequirementFeedback(correct);
  expect(dispatch).toHaveBeenCalledWith({
    type: types.SET_REQUIREMENT_FEEDBACK,
    correct
  });
});
