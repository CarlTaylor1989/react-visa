/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import FamilyProducts from
  '../../../../../components/generic/dashboard/productsview/FamilyProducts';

let mockProps;
beforeEach(() => {
  mockProps = {
    closePopup: jest.fn(),
    familyId: 'm1f2',
    familyName: 'irrelevant',
    mapId: 'm1',
    type: 'type2'
  };
});

test('renders the FamilyProducts component', () => {
  const wrapper = shallow(<FamilyProducts {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
