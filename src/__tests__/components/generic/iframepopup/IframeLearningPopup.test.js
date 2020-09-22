/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import IframeLearningPopup from '../../../../components/generic/iframepopup/IframeLearningPopup';
import { getDeeplinkURL } from '../../../../lib/deeplinks';

jest.mock('../../../../lib/deeplinks');

let mockProps;
beforeEach(() => {
  mockProps = {
    closePopup: jest.fn(),
    gomoId: 'p0',
    iframeSrc: '',
    onExited: jest.fn(),
    showPopup: false,
  };
});

test('renders a closed popup', () => {
  const wrapper = shallow(<IframeLearningPopup {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders an open popup', () => {
  const wrapper = shallow(<IframeLearningPopup {...mockProps} showPopup />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidUpdate()', () => {
  test('setIframeSrc() is not called', () => {
    // setup
    const wrapper = shallow(<IframeLearningPopup {...mockProps} />);
    wrapper.instance().setIframeSrc = jest.fn();
    wrapper.setProps({ showPopup: false });

    // function under test
    wrapper.update();

    // expectation
    expect(wrapper.instance().setIframeSrc).not.toHaveBeenCalled();
  });

  test('setIframeSrc() is called', () => {
    // setup
    const wrapper = shallow(<IframeLearningPopup {...mockProps} />);
    wrapper.instance().setIframeSrc = jest.fn();
    wrapper.setProps({ showPopup: true });

    // function under test
    wrapper.update();

    // expectation
    expect(wrapper.instance().setIframeSrc).toHaveBeenCalled();
  });
});

describe('method setIframeSrc()', () => {
  test('sets the source to a dummy file', () => {
    const wrapper = shallow(<IframeLearningPopup {...mockProps} />);
    wrapper.instance().setIframeSrc('');
    expect(wrapper.instance().state).toEqual(expect.objectContaining({
      dummySco: true,
      iframeSrc: expect.any(String)
    }));
  });

  test('gets and displays the deeplink of a learning', () => {
    // setup
    global.process.env.PLATFORM = 'production';
    mockProps.iframeSrc = 'irrelevant.html';
    const wrapper = shallow(<IframeLearningPopup {...mockProps} />);

    // function under test
    wrapper.instance().setIframeSrc();

    // expectations
    expect(getDeeplinkURL).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
    const options = getDeeplinkURL.mock.calls[0][1];
    options.success('irrelevant');
    expect(wrapper.instance().state).toEqual(expect.objectContaining({
      dummySco: false,
      iframeSrc: expect.any(String)
    }));
    options.error();
    expect(wrapper.instance().state).toEqual(expect.objectContaining({
      dummySco: false,
      iframeSrc: 'about:blank',
      displayError: true,
      showLoader: false
    }));
  });
});
