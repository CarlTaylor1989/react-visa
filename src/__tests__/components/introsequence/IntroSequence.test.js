/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import { IntroSequence, mapStateToProps } from '../../../components/introsequence/IntroSequence';
import { sendInteractionData } from '../../../tracking/xapi/XApiAdapter';

jest.mock('../../../tracking/xapi/XApiAdapter');

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    lessonLocation: '',
    slideIndex: 0,
    screenReferrer: 'irrelevant',
    setIntroSeqCompleted: jest.fn(),
    setPopupReferrer: jest.fn(),
    setScreenReferrer: jest.fn()
  };
});

test('renders the IntroSequence component', () => {
  const wrapper = shallow(<IntroSequence {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('method componentDidMount()', () => {
  // setup
  const wrapper = shallow(<IntroSequence {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().slider = {
    props: {
      children: [1, 2, 3]
    }
  };

  // function under test
  wrapper.instance().componentDidMount();

  // expectation
  expect(wrapper.instance().state.noOfSlides).toEqual(3);
});

test('method componentWillUnmount()', () => {
  // setup
  const wrapper = shallow(<IntroSequence {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().sendSlideTrackingData = jest.fn();
  wrapper.instance().sendCompletionTrackingData = jest.fn();

  // function under test
  wrapper.instance().componentWillUnmount();

  // expectations
  expect(wrapper.instance().sendSlideTrackingData).toHaveBeenCalled();
  expect(wrapper.instance().sendCompletionTrackingData).toHaveBeenCalled();
});

test('method setSliderReference()', () => {
  // setup
  const wrapper = shallow(<IntroSequence {...mockProps} />);
  const slider = { foo: 'bar' };

  // function under test
  wrapper.instance().setSliderReference(slider);

  // expectation
  expect(wrapper.instance().slider).toEqual(slider);
});

describe('method onBeforeChange()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<IntroSequence {...mockProps} />);
    wrapper.instance().setState({ noOfSlides: 3 });
  });

  test('goes to the second slide', () => {
    wrapper.instance().onBeforeChange(0, 1);
    expect(wrapper.instance().state.currentIndex).toEqual(1);
  });

  test('goes to the last slide and complets the intro', () => {
    wrapper.instance().onBeforeChange(1, 2);
    expect(wrapper.instance().state.currentIndex).toEqual(2);
  });
});

test('method onAfterChange()', () => {
  const wrapper = shallow(<IntroSequence {...mockProps} />);
  wrapper.instance().onAfterChange();
  expect(wrapper.instance().slideAvailable).toEqual(expect.any(Date));
});

test('method onBack()', () => {
  // setup
  const wrapper = shallow(<IntroSequence {...mockProps} />);
  wrapper.instance().slider = {
    slickPrev: jest.fn()
  };

  // function under test
  wrapper.instance().onBack();

  // expectation
  expect(wrapper.instance().slider.slickPrev).toHaveBeenCalled();
});

test('method onNext()', () => {
  // setup
  const wrapper = shallow(<IntroSequence {...mockProps} />);
  wrapper.instance().slider = {
    slickNext: jest.fn()
  };

  // function under test
  wrapper.instance().onNext();

  // expectation
  expect(wrapper.instance().slider.slickNext).toHaveBeenCalled();
});

test('method onIntroComplete()', () => {
  // setup
  const screenId = 'irrelevant';
  const wrapper = shallow(<IntroSequence {...mockProps} />);
  wrapper.instance().onGoToScreen = jest.fn();

  // function under test
  wrapper.instance().onIntroComplete(screenId);

  // expectations
  expect(mockProps.setScreenReferrer).toHaveBeenCalled();
  expect(wrapper.instance().onGoToScreen).toHaveBeenCalledWith(screenId);
});

test('route buttons call onIntroComplete() on click', () => {
  // setup
  const wrapper = shallow(<IntroSequence {...mockProps} />);
  wrapper.instance().onIntroComplete = jest.fn();

  // triggers click events
  wrapper.find('.clientPropsBtn').simulate('click');
  wrapper.find('.productNetworkBtn').simulate('click');

  // expectations
  expect(wrapper.instance().onIntroComplete).toHaveBeenCalledWith(expect.any(String));
  expect(wrapper.instance().onIntroComplete).toHaveBeenCalledTimes(2);
});

test('method sendSlideTrackingData()', () => {
  // setup
  const wrapper = shallow(<IntroSequence {...mockProps} />);
  wrapper.instance().slideAvailable = new Date();

  // function under test
  wrapper.instance().sendSlideTrackingData();

  // expectation
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'experienced',
    activity: expect.objectContaining({
      id: expect.stringContaining('introsequence/slide'),
      type: 'slide',
      title: expect.any(String),
      description: expect.any(String)
    }),
    response: expect.objectContaining({
      timeAvailable: expect.any(Date),
      timeResponse: expect.any(Date)
    }),
    parent: 'introsequence',
    referrer: expect.any(String)
  }));
});

test('method sendCompletionTrackingData()', () => {
  const wrapper = shallow(<IntroSequence {...mockProps} />);
  wrapper.instance().sendCompletionTrackingData();
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'completed',
    activity: expect.objectContaining({
      id: expect.any(String),
      type: 'slide-deck',
      title: expect.any(String),
      description: expect.any(String)
    }),
    response: expect.objectContaining({
      timeAvailable: expect.any(Date),
      timeResponse: expect.any(Date)
    }),
    parent: ''
  }));
});

test('should mapStateToProps', () => {
  const state = {
    genericData: {
      screenReferrer: 'irrelevant'
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    ...state.genericData
  });
});
