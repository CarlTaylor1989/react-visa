/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import TutorialCarousel from '../../../../components/generic/tutorialpopup/TutorialCarousel';
import { sendInteractionData } from '../../../../tracking/xapi/XApiAdapter';

jest.mock('../../../../tracking/xapi/XApiAdapter');

let mockProps;
beforeEach(() => {
  mockProps = {
    slideIndex: 0,
    setSlideIndex: jest.fn()
  };
});

test('renders the TutorialCarousel component', () => {
  const wrapper = shallow(<TutorialCarousel {...mockProps} title="irrelevant" />, {
    disableLifecycleMethods: true
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
  expect(wrapper.instance().state.noOfSlides).toEqual(0);
});

test('method componentDidMount()', () => {
  // setup
  const wrapper = shallow(<TutorialCarousel {...mockProps} />, {
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

describe('method componentDidUpdate()', () => {
  let wrapper;
  let slickGoTo;
  beforeEach(() => {
    slickGoTo = jest.fn();
    wrapper = shallow(<TutorialCarousel {...mockProps} />);
    wrapper.instance().slider = { slickGoTo };
  });

  test('navigates to a new slide', () => {
    wrapper.setProps({
      slideIndex: 10
    });
    expect(slickGoTo).toHaveBeenCalledWith(expect.any(Number), expect.any(Boolean));
  });

  test('remains on the current slide', () => {
    wrapper.setProps({
      slideIndex: mockProps.slideIndex
    });
    expect(slickGoTo).not.toHaveBeenCalled();
  });
});

test('method componentWillUnmount()', () => {
  // setup
  const wrapper = shallow(<TutorialCarousel {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().sendSlideTrackingData = jest.fn();
  wrapper.instance().onSlideViewed = jest.fn();

  // function under test
  wrapper.instance().componentWillUnmount();

  // expectation
  expect(wrapper.instance().sendSlideTrackingData).toHaveBeenCalled();
  expect(wrapper.instance().onSlideViewed).toHaveBeenCalled();
});

test('method onCarouselInit()', () => {
  // setup
  const wrapper = shallow(<TutorialCarousel {...mockProps} />);
  wrapper.instance().onSlideViewed = jest.fn();

  // function under test
  wrapper.instance().onCarouselInit();

  // expectations
  expect(wrapper.instance().onSlideViewed).toHaveBeenCalled();
  expect(wrapper.instance().slideAvailable).toEqual(expect.any(Date));
});

test('method onBeforeChange()', () => {
  // setup
  const next = 1;
  const wrapper = shallow(<TutorialCarousel {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().onSlideViewed = jest.fn();

  // function under test
  wrapper.instance().onBeforeChange(0, next);

  // expectations
  expect(mockProps.setSlideIndex).toHaveBeenCalledWith(next);
  expect(wrapper.instance().onSlideViewed).toHaveBeenCalled();
});

test('method onAfterChange()', () => {
  const wrapper = shallow(<TutorialCarousel {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().onAfterChange();
  expect(wrapper.instance().slideAvailable).toEqual(expect.any(Date));
});

test('method onBack()', () => {
  // setup
  const wrapper = shallow(<TutorialCarousel {...mockProps} />, {
    disableLifecycleMethods: true
  });
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
  const wrapper = shallow(<TutorialCarousel {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().slider = {
    slickNext: jest.fn()
  };

  // function under test
  wrapper.instance().onNext();

  // expectation
  expect(wrapper.instance().slider.slickNext).toHaveBeenCalled();
});

describe('method onSlideViewed()', () => {
  test('onSectionComplete() method is not called as a slide of same section was not viewed', () => {
    // setup
    const wrapper = shallow(<TutorialCarousel {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().onSectionCompleteSpy = jest.fn();
    wrapper.instance().tutorialSlides = [
      {
        section: 't1',
        viewed: true
      },
      {
        section: 't1',
        viewed: false
      }
    ];

    // function under test
    wrapper.instance().onSlideViewed();

    // expectation
    expect(wrapper.instance().onSectionCompleteSpy).not.toHaveBeenCalled();
  });

  test('onSectionComplete() method is called as both slides of same section were viewed', () => {
    // setup
    const wrapper = shallow(<TutorialCarousel {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().onSectionComplete = jest.fn();
    wrapper.instance().tutorialSlides = [
      {
        section: 't1',
        viewed: true
      },
      {
        section: 't1',
        viewed: true
      }
    ];

    // function under test
    wrapper.instance().onSlideViewed();

    // expectation
    expect(wrapper.instance().onSectionComplete).toHaveBeenCalledWith(expect.any(String));
  });
});

describe('method onSectionComplete()', () => {
  test('setState is called', () => {
    // setup
    const wrapper = shallow(<TutorialCarousel {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setState({ sectionsViewed: [] });
    wrapper.instance().setState = jest.fn();
    wrapper.instance().sendSectionCompletedTrackingData = jest.fn();

    // function under test
    wrapper.instance().onSectionComplete('t1');

    // expectation
    expect(wrapper.instance().setState)
      .toHaveBeenCalledWith({
        sectionsViewed: ['t1']
      });
    expect(wrapper.instance().sendSectionCompletedTrackingData).toHaveBeenCalled();
  });

  test('setState is not called as section already exists', () => {
    // setup
    const wrapper = shallow(<TutorialCarousel {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setState({ sectionsViewed: ['t1'] });
    wrapper.instance().setState = jest.fn();

    // function under test
    wrapper.instance().onSectionComplete('t1');

    // expectation
    expect(wrapper.instance().setState).not.toHaveBeenCalled();
  });
});

test('method setSliderReference()', () => {
  // setup
  const wrapper = shallow(<TutorialCarousel {...mockProps} />, {
    disableLifecycleMethods: true
  });
  const slider = { foo: 'bar' };

  // function under test
  wrapper.instance().setSliderReference(slider);

  // expectation
  expect(wrapper.instance().slider).toEqual(slider);
});

test('method sendSectionCompletedTrackingData()', () => {
  // setup
  const wrapper = shallow(<TutorialCarousel {...mockProps} />, {
    disableLifecycleMethods: true
  });

  // function under test
  wrapper.instance().sendSectionCompletedTrackingData();

  // expectation
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'completed',
    activity: expect.objectContaining({
      id: expect.stringContaining('tutorial'),
      type: 'slide-deck',
      title: expect.any(String)
    }),
    parent: expect.stringContaining('')
  }));
});

test('method sendSlideTrackingData()', () => {
  // setup
  const wrapper = shallow(<TutorialCarousel {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().slideAvailable = new Date();

  // function under test
  wrapper.instance().sendSlideTrackingData();

  // expectation
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'experienced',
    activity: expect.objectContaining({
      id: expect.stringContaining('tutorial'),
      type: 'slide',
      title: expect.any(String)
    }),
    response: expect.objectContaining({
      timeAvailable: expect.any(Date),
      timeResponse: expect.any(Date)
    }),
    parent: expect.stringContaining('tutorial')
  }));
});
