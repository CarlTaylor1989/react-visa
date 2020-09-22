/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  ProductCompletion,
  mapStateToProps
} from '../../../../../components/generic/dashboard/productsview/ProductCompletion';
import {
  CHALLENGE_COMPLETION_STATUS,
  CHALLENGE_PERFECT_STATUS
} from '../../../../../config/constants';

let mockProps;
beforeEach(() => {
  mockProps = {
    challenges: [{
      id: 'c1',
      familyId: 'm1f2',
      productId: 'p3',
      status: CHALLENGE_COMPLETION_STATUS
    }, {
      id: 'c2',
      familyId: 'm1f2',
      productId: 'p3',
      status: CHALLENGE_PERFECT_STATUS
    }, {
      id: 'c3',
      familyId: 'm1f2',
      productId: 'p4',
      status: CHALLENGE_PERFECT_STATUS
    }],
    familyId: 'm1f2',
    productId: 'p3',
    closePopup: jest.fn()
  };
});

test('renders the ProductCompletion component', () => {
  const wrapper = shallow(<ProductCompletion {...mockProps} />);
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
