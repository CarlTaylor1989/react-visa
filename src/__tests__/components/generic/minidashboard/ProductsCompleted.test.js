/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  ProductsCompleted,
  mapStateToProps
} from '../../../../components/generic/minidashboard/ProductsCompleted';

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    challenges: [{
      isFinal: false,
      status: 4
    }, {
      isFinal: true,
      status: 3
    }, {
      isFinal: true,
      status: 4
    }]
  };
});

test('renders the ProductsCompleted component', () => {
  const wrapper = shallow(<ProductsCompleted {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('should mapStateToProps', () => {
  const state = {
    mapData: {
      challenges: []
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    ...state.mapData
  });
});
