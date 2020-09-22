/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import SolutionsInfo from
  '../../../../../components/game/clientproposals/proposals/SolutionsInfo';
import { sendInteractionData } from '../../../../../tracking/xapi/XApiAdapter';

jest.mock('../../../../../tracking/xapi/XApiAdapter');

let mockProps;
beforeEach(() => {
  mockProps = {
    id: '0',
    type: 'services',
    client: 'client1',
    closeInfo: jest.fn(),
    showInfo: true
  };
});

test('renders a visible SolutionsInfo component', () => {
  const wrapper = shallow(<SolutionsInfo {...mockProps} />, {
    disableLifecycleMethods: true
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders a hidden SolutionsInfo component', () => {
  const wrapper = shallow(<SolutionsInfo {...mockProps} showInfo={false} />, {
    disableLifecycleMethods: true
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidUpdate()', () => {
  test('sets the timeAvailable', () => {
    const wrapper = shallow(<SolutionsInfo {...mockProps} showInfo={false} />);
    wrapper.setProps({
      showInfo: true
    });
    expect(wrapper.instance().timeAvailable).toBeDefined();
  });

  test('timeAvailable in not defined', () => {
    const wrapper = shallow(<SolutionsInfo {...mockProps} />);
    wrapper.setProps({
      showInfo: false
    });
    expect(wrapper.instance().timeAvailable).toBeNull();
  });
});

describe('method componentWillUnmount()', () => {
  test('calls the method sendPopupStatement()', () => {
    // setup
    const wrapper = shallow(<SolutionsInfo {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().timeAvailable = new Date();
    wrapper.instance().sendPopupStatement = jest.fn();

    // function under test
    wrapper.instance().componentWillUnmount();

    // expectation
    expect(wrapper.instance().sendPopupStatement).toHaveBeenCalled();
  });

  test('method sendPopupStatement() is not called', () => {
    // setup
    const wrapper = shallow(<SolutionsInfo {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().sendPopupStatement = jest.fn();

    // function under test
    wrapper.instance().componentWillUnmount();

    // expectation
    expect(wrapper.instance().sendPopupStatement).not.toHaveBeenCalled();
  });
});

test('method onClose()', () => {
  // setup
  const wrapper = shallow(<SolutionsInfo {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().sendPopupStatement = jest.fn();

  // function under test
  wrapper.instance().onClose();

  // expectations
  expect(wrapper.instance().sendPopupStatement).toHaveBeenCalled();
  expect(mockProps.closeInfo).toHaveBeenCalled();
});

test('method sendPopupStatement()', () => {
  // setup
  const wrapper = shallow(<SolutionsInfo {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().timeAvailable = new Date();

  // function under test
  wrapper.instance().sendPopupStatement();

  // expectation
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'experienced',
    activity: expect.objectContaining({
      id: expect.stringContaining('question'),
      type: 'slide',
      title: expect.any(String),
      description: expect.any(String)
    }),
    response: expect.objectContaining({
      timeAvailable: expect.any(Date),
      timeResponse: expect.any(Date)
    }),
    parent: expect.any(String)
  }));
});
