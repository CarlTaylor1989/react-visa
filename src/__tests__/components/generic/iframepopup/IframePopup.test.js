import React from 'react'; // eslint-disable-line no-unused-vars
import IframePopup from '../../../../components/generic/iframepopup/IframePopup';
import { loadSco } from '../../../../lib/loadsco';
import { hideCourseExit } from '../../../../lib/iframecontent';
import { sendInteractionData } from '../../../../tracking/xapi/XApiAdapter';

jest.mock('../../../../lib/loadsco');
jest.mock('../../../../lib/iframecontent');
jest.mock('../../../../tracking/xapi/XApiAdapter');

jest.useFakeTimers();

let mockProps;
beforeEach(() => {
  mockProps = {
    closePopup: jest.fn(),
    iframeSrc: 'about:blank',
    popupReferrer: 'irrelevant',
    showPopup: false
  };
});

test('renders the base IframePopup component', () => {
  // setup
  const wrapper = shallow(<IframePopup {...mockProps} />);

  // expectations
  expect(wrapper.get(0)).toBeNull();
  wrapper.instance().setIframeRef({});
  expect(wrapper.instance().scoIframe).toBeDefined();
});

describe('method onIframeLoaded()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<IframePopup {...mockProps} />);
    wrapper.instance().hideIframePopupLoader = jest.fn();
  });

  test('method loadSco() is called', () => {
    // setup
    wrapper.instance().setState({ dummySco: false });

    // function under test
    wrapper.instance().onIframeLoaded();

    // expectations
    expect(loadSco).toHaveBeenCalled();
    expect(hideCourseExit).toHaveBeenCalled();
    expect(wrapper.instance().hideIframePopupLoader).not.toHaveBeenCalled();
  });

  test('method loadSco() is not called', () => {
    // function under test
    wrapper.instance().onIframeLoaded();

    // expectations
    expect(loadSco).not.toHaveBeenCalled();
    expect(hideCourseExit).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    expect(wrapper.instance().hideIframePopupLoader).toHaveBeenCalled();
  });
});

describe('method onExitSco()', () => {
  test('calls commit on a gomo course', () => {
    // setup
    const saveState = jest.fn();
    const wrapper = shallow(<IframePopup {...mockProps} showPopup />);
    wrapper.instance().scoIframe = {
      src: 'about:blank',
      contentWindow: {
        CONTENT_TRACKING: {
          saveState
        }
      }
    };

    // function under test
    wrapper.instance().onExitSco();

    // expectations
    expect(saveState).toHaveBeenCalled();
    expect(wrapper.instance().scoIframe.src).toBe('');
    expect(mockProps.closePopup).toHaveBeenCalled();
  });

  test('an iframe with a url', () => {
    // setup
    const wrapper = shallow(<IframePopup {...mockProps} showPopup />);
    wrapper.instance().scoIframe = {
      src: 'about:blank',
      contentWindow: {}
    };

    // function under test
    wrapper.instance().onExitSco();

    // expectations
    expect(wrapper.instance().scoIframe.src).toBe('');
    expect(mockProps.closePopup).toHaveBeenCalled();
  });
});

test('method onGomoCourseOpened()', () => {
  const gomoId = 'p0';
  const wrapper = shallow(<IframePopup {...mockProps} />);
  wrapper.instance().onGomoCourseOpened(gomoId);
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'opened',
    activity: expect.objectContaining({
      id: gomoId,
      type: 'course',
      title: expect.any(String),
      description: expect.any(String),
      gomoCourse: true
    }),
    parent: expect.any(String),
    referrer: expect.any(String)
  }));
});

test('method hideIframePopupLoader()', () => {
  const wrapper = shallow(<IframePopup {...mockProps} />);
  wrapper.instance().hideIframePopupLoader();
  expect(wrapper.instance().state.showLoader).toBeFalsy();
});

test('method displayIframePopupLoader()', () => {
  const wrapper = shallow(<IframePopup {...mockProps} />);
  wrapper.instance().displayIframePopupLoader();
  expect(wrapper.instance().state.showLoader).toBeTruthy();
});
