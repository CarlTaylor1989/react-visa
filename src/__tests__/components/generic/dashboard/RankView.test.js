/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  RankView,
  mapStateToProps
} from '../../../../components/generic/dashboard/RankView';
import { sendInteractionData } from '../../../../tracking/xapi/XApiAdapter';

jest.mock('../../../../tracking/xapi/XApiAdapter');

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    rank: 'r20',
    total: 0
  };
});

test('render RankView component', () => {
  const wrapper = shallow(<RankView {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method componentDidMount()', () => {
  const wrapper = shallow(<RankView {...mockProps} />);
  const offsetTop = 200;
  const offsetHeight = 67;
  wrapper.instance().rankRef = { current: { offsetTop, offsetHeight } };
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().state.scrollTop).toEqual(offsetTop - offsetHeight);
});

test('method componentWillUnmount()', () => {
  const wrapper = shallow(<RankView {...mockProps} />);
  wrapper.instance().componentWillUnmount();
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'experienced',
    activity: expect.objectContaining({
      id: expect.stringContaining('rank'),
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

test('should mapStateToProps', () => {
  const state = {
    scoreData: {
      rank: 'r15',
      total: 900000
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    ...state.scoreData
  });
});
