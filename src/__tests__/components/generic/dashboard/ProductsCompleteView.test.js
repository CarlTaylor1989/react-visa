/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import ProductsCompleteView from '../../../../components/generic/dashboard/ProductsCompleteView';
import { sendInteractionData } from '../../../../tracking/xapi/XApiAdapter';

jest.mock('../../../../tracking/xapi/XApiAdapter');

let mockProps;
beforeEach(() => {
  mockProps = {
    closePopup: jest.fn()
  };
});

test('render ProductsCompleteView component', () => {
  const wrapper = shallow(<ProductsCompleteView {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method componentWillUnmount()', () => {
  const wrapper = shallow(<ProductsCompleteView {...mockProps} />);
  wrapper.instance().componentWillUnmount();
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'experienced',
    activity: expect.objectContaining({
      id: expect.stringContaining('products'),
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
