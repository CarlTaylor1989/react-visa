/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import IntroSequencePopup from
  '../../../../components/generic/introsequencepopup/IntroSequencePopup';

let mockProps;
beforeEach(() => {
  mockProps = {
    onClose: jest.fn(),
    open: false,
    translations: 'clientprops'
  };
});

test('renders the IntroSequencePopup component', () => {
  const wrapper = shallow(<IntroSequencePopup {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the IntroSequencePopup component with hidden buttons', () => {
  const wrapper = shallow(<IntroSequencePopup {...mockProps} />);
  wrapper.instance().setState({
    currentIndex: 1,
    noOfSlides: 2,
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidMount called', () => {
  test('called with slick ref set', () => {
    // setup
    const wrapper = shallow(<IntroSequencePopup {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().sliderRef = {
      current: {
        props: { children: [] },
        slickNext: jest.fn(),
        slickPrev: jest.fn()
      }
    };

    // function under test
    wrapper.instance().componentDidMount();

    // expectation
    expect(wrapper.instance().state.noOfSlides).toEqual(0);
  });

  test('called with slick ref not set', () => {
    const wrapper = shallow(<IntroSequencePopup {...mockProps} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().state.noOfSlides).toEqual(0);
  });
});

test('method onBeforeChange()', () => {
  const wrapper = shallow(<IntroSequencePopup {...mockProps} />);
  wrapper.instance().onBeforeChange(0, 1);
  expect(wrapper.instance().state.currentIndex).toEqual(1);
});

test('method onBack()', () => {
  // setup
  const wrapper = shallow(<IntroSequencePopup {...mockProps} />);
  wrapper.instance().setState({
    currentIndex: 1,
  });
  wrapper.instance().sliderRef = {
    current: {
      slickNext: jest.fn(),
      slickPrev: jest.fn()
    }
  };

  // function under test
  wrapper.instance().onBack();

  // expectation
  expect(wrapper.instance().sliderRef.current.slickPrev).toHaveBeenCalled();
});

test('method onNext()', () => {
  // setup
  const wrapper = shallow(<IntroSequencePopup {...mockProps} />);
  wrapper.instance().setState({
    currentIndex: 1,
  });
  wrapper.instance().sliderRef = {
    current: {
      slickNext: jest.fn(),
      slickPrev: jest.fn()
    }
  };

  // function under test
  wrapper.instance().onNext();

  // expectation
  expect(wrapper.instance().sliderRef.current.slickNext).toHaveBeenCalled();
});
