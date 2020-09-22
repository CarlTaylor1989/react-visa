/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ProductPrompt from '../../../../components/generic/prompts/ProductPrompt';

let mockProps;

beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    familyId: 'm1f2',
    productId: 'p4',
    mapId: 'm1',
    setPlayAudio: jest.fn()
  };
});

test('renders the ProductPrompt', () => {
  const wrapper = shallow(<ProductPrompt {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});
