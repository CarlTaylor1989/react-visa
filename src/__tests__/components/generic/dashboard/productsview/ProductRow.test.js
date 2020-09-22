/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  ProductRow,
  mapStateToProps,
  mapDispatchToProps
} from '../../../../../components/generic/dashboard/productsview/ProductRow';
import * as actions from '../../../../../actions/map';
import * as types from '../../../../../actions/mapTypes';

let mockProps;
beforeEach(() => {
  mockProps = {
    closePopup: jest.fn(),
    completedProducts: [],
    familyId: 'm1f2',
    mapId: 'm1',
    productId: 'p3',
    productName: 'irrelevant',
    setCurrentFamilyProduct: jest.fn(),
    setScreenReferrer: jest.fn(),
    type: 'type2'
  };
});

test('renders the ProductRow component with the incomplete styles', () => {
  const wrapper = shallow(<ProductRow {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ProductRow component with the complete styles', () => {
  mockProps.completedProducts = ['m1f2p3'];
  const wrapper = shallow(<ProductRow {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method onProductRowClick()', () => {
  // setup
  const wrapper = shallow(<ProductRow {...mockProps} />);

  // function under test
  wrapper.instance().onProductRowClick();

  // expectations
  expect(mockProps.setScreenReferrer).toHaveBeenCalledWith(expect.any(String));
  expect(mockProps.setCurrentFamilyProduct).toHaveBeenCalled();
  expect(mockProps.closePopup).toHaveBeenCalled();
});

test('should mapStateToProps', () => {
  const state = {
    mapData: {
      completedProducts: []
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    ...state.mapData
  });
});

test('should mapDispatchToProps', () => {
  // setup
  const currentMap = 'm1';
  const currentFamily = 'm1f1';
  const currentProduct = 'p1';
  const dispatch = jest.fn();
  jest.spyOn(actions, 'setCurrentFamilyProduct').mockReturnValue('setCurrentFamilyProduct()');
  const props = mapDispatchToProps(dispatch);

  // function under test
  props.setCurrentFamilyProduct(currentMap, currentFamily, currentProduct);

  // expectation
  expect(dispatch).toHaveBeenCalledWith({
    type: types.SET_CURRENT_FAMILY_PRODUCT,
    currentMap,
    currentFamily,
    currentProduct
  });
});
