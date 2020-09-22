/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  Dashboard,
  mapDispatchToProps
} from '../../../../components/generic/dashboard/Dashboard';
import * as hintActions from '../../../../actions/hints';
import * as hintTypes from '../../../../actions/hintsTypes';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    closeDashboard: jest.fn(),
    displayDashboard: true,
    setHintsPaused: jest.fn()
  };
});

test('renders a closed Dashboard popup', () => {
  const wrapper = shallow(<Dashboard {...mockProps} displayDashboard={false} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders an open Dashboard popup', () => {
  const wrapper = shallow(<Dashboard {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method getContent()', () => {
  test('AchievementsView component', () => {
    const wrapper = shallow(<Dashboard {...mockProps} />);
    wrapper.instance().setState({ page: 'achievements' });
    expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
  });

  test('RankView component', () => {
    const wrapper = shallow(<Dashboard {...mockProps} />);
    const page = 'rank';
    wrapper.instance().setState({ page });
    expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
  });

  test('ProductsCompleteView component', () => {
    const wrapper = shallow(<Dashboard {...mockProps} />);
    wrapper.instance().setState({ page: 'productsCompleted' });
    expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
  });
});

test('method setView()', () => {
  const wrapper = shallow(<Dashboard {...mockProps} />);
  const page = 'rank';
  wrapper.instance().setView(page);
  expect(wrapper.instance().state.page).toEqual(page);
});

test('method setView() is called from achievements button click', () => {
  const wrapper = shallow(<Dashboard {...mockProps} />);
  wrapper.instance().setView = jest.fn();
  wrapper.find('.achievementsBtn').first().simulate('click');
  expect(wrapper.instance().setView).toHaveBeenCalledWith('achievements');
});

test('method setView() is called from rank button click', () => {
  const wrapper = shallow(<Dashboard {...mockProps} />);
  wrapper.instance().setView = jest.fn();
  wrapper.find('.rankBtn').first().simulate('click');
  expect(wrapper.instance().setView).toHaveBeenCalledWith('rank');
});

test('method setView() is called from products completed button click', () => {
  const wrapper = shallow(<Dashboard {...mockProps} />);
  wrapper.instance().setView = jest.fn();
  wrapper.find('.productsCompletedBtn').first().simulate('click');
  expect(wrapper.instance().setView).toHaveBeenCalledWith('productsCompleted');
});

describe('should mapDispatchToProps', () => {
  test('SET_HINTS_PAUSED', () => {
    const dispatch = jest.fn();
    jest.spyOn(hintActions, 'setHintsPaused').mockReturnValue('setHintsPaused()');
    const props = mapDispatchToProps(dispatch);
    props.setHintsPaused();
    expect(dispatch).toHaveBeenCalledWith({
      type: hintTypes.SET_HINTS_PAUSED
    });
  });
});
