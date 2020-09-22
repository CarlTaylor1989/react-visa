/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  ProductIcon,
  mapStateToProps,
  mapDispatchToProps
} from '../../../../components/game/network/ProductIcon';
import {
  CHALLENGE_PERFECT_STATUS,
  CHALLENGE_COMPLETION_STATUS,
  PRODUCT_COMPLETED_CLASS
} from '../../../../config/constants';
import * as actions from '../../../../actions/map';
import * as types from '../../../../actions/mapTypes';

let mockProps;
beforeEach(() => {
  mockProps = {
    challenges: [],
    coordinates: [100, 100],
    familyId: 'm1f1',
    lastChallengesModified: [],
    currentProduct: '',
    mapId: 'm1',
    mapInitialised: false,
    priorityPosition: 'topRight',
    productId: 'p1',
    region: 'foo',
    setCurrentFamilyProduct: jest.fn()
  };
});

test('renders the ProductIcon button component with the incomplete state', () => {
  const wrapper = shallow(<ProductIcon {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ProductIcon button component with the prioritity flag', () => {
  const wrapper = shallow(<ProductIcon
    {...mockProps}
    familyId="m1f2"
    productId="p3"
    region="na"
  />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ProductIcon component with the incomplete state', () => {
  const wrapper = shallow(<ProductIcon {...mockProps} useButton={false} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the ProductIcon component with the prioritity flag', () => {
  const wrapper = shallow(<ProductIcon
    {...mockProps}
    familyId="m1f2"
    productId="p3"
    region="na"
    useButton={false}
  />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method componentDidUpdate()', () => {
  const wrapper = shallow(<ProductIcon {...mockProps} />);
  wrapper.instance().updateProductState = jest.fn();
  wrapper.setProps({
    lastChallengesModified: ['c1', 'c2'],
    currentProduct: 'p1'
  });
  wrapper.update();
  expect(wrapper.instance().updateProductState).toHaveBeenCalled();
});

test('method onProductClick()', () => {
  const wrapper = shallow(<ProductIcon {...mockProps} />);
  wrapper.instance().onProductClick();
  expect(mockProps.setCurrentFamilyProduct).toHaveBeenCalledWith(
    mockProps.mapId,
    mockProps.familyId,
    mockProps.productId
  );
});

describe('method updateProductState()', () => {
  test('last modidied challenge completed', () => {
    const challenges = [{
      id: 'c1',
      familyId: 'm1f1',
      productId: 'p1',
      status: CHALLENGE_COMPLETION_STATUS,
      isFinal: true
    }];
    const wrapper = shallow(<ProductIcon
      {...mockProps}
      challenges={challenges}
      lastChallengesModified={['c1']}
    />);
    wrapper.instance().updateProductState();
    expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
    expect(wrapper.instance().state.status).toBe(PRODUCT_COMPLETED_CLASS);
  });

  test('last modidied challenge perfected', () => {
    const challenges = [{
      id: 'c1',
      familyId: 'm1f1',
      productId: 'p1',
      status: CHALLENGE_PERFECT_STATUS,
      isFinal: true
    }];
    const wrapper = shallow(<ProductIcon
      {...mockProps}
      challenges={challenges}
      lastChallengesModified={['c1']}
    />);
    wrapper.instance().updateProductState();
    expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
    expect(wrapper.instance().state.status).toBe(PRODUCT_COMPLETED_CLASS);
  });

  test('challenge not in last modified', () => {
    const challenges = [{
      id: 'c2',
      familyId: 'm1f1',
      productId: 'p1',
      status: CHALLENGE_PERFECT_STATUS,
      isFinal: true
    }];
    const wrapper = shallow(<ProductIcon
      {...mockProps}
      challenges={challenges}
      lastChallengesModified={['c1']}
    />);
    wrapper.instance().updateProductState();
    expect(wrapper.instance().state.status).toBe(PRODUCT_COMPLETED_CLASS);
  });
});

test('should mapStateToProps', () => {
  const state = {
    mapData: {
      initialised: false,
      challenges: [],
      lastChallengesModified: [],
      currentProduct: ''
    },
    diagnosticData: {
      region: 'foo'
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    mapInitialised: false,
    challenges: [],
    lastChallengesModified: [],
    currentProduct: '',
    ...state.diagnosticData
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
