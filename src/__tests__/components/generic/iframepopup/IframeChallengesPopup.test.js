/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import IframeChallengesPopup
  from '../../../../components/generic/iframepopup/IframeChallengesPopup';
import { getDeeplinkURL } from '../../../../lib/deeplinks';

jest.mock('../../../../lib/deeplinks');

let mockProps;
beforeEach(() => {
  mockProps = {
    closePopup: jest.fn(),
    iframeSrc: 'about:blank',
    onExited: jest.fn(),
    showPopup: true
  };
});

test('renders a closed popup', () => {
  // setup
  const wrapper = shallow(<IframeChallengesPopup {...mockProps} showPopup={false} />);

  // expectations
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
  wrapper.instance().setChallengeNavigatorRef({});
  expect(wrapper.instance().challengeNavigator).toBeDefined();
});

test('renders an open popup', () => {
  const wrapper = shallow(<IframeChallengesPopup {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method updateChallengeData()', () => {
  let updateChallengeData;
  let wrapper;
  const score = 50;
  const status = {
    completion: 'incomplete',
    success: 'failed'
  };
  beforeEach(() => {
    updateChallengeData = jest.fn();
    wrapper = shallow(<IframeChallengesPopup {...mockProps} />);
  });

  test('cannot update challenge data', () => {
    wrapper.instance().updateChallengeData(status, score);
    expect(updateChallengeData).not.toHaveBeenCalled();
  });

  test('updates the challenge data', () => {
    wrapper.instance().challengeNavigator = { updateChallengeData };
    wrapper.instance().updateChallengeData(status, score);
    expect(updateChallengeData).toHaveBeenCalled();
  });
});

describe('method setIframeSrc()', () => {
  test('sets the source to a dummy file', () => {
    const wrapper = shallow(<IframeChallengesPopup {...mockProps} />);
    wrapper.instance().setIframeSrc('');
    expect(wrapper.instance().state).toEqual(expect.objectContaining({
      dummySco: true,
      iframeSrc: expect.any(String)
    }));
  });

  test('gets and displays the deeplink of a challenge', () => {
    // setup
    global.process.env.PLATFORM = 'production';
    const wrapper = shallow(<IframeChallengesPopup {...mockProps} />);

    // function under test
    wrapper.instance().setIframeSrc('irrelevant');

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
      showLoader: false,
      displayError: true
    }));
  });
});

describe('method onExitPopup()', () => {
  test('method onExitChallenges() called', () => {
    // setup
    const onExitChallenges = jest.fn().mockReturnValue(true);
    const wrapper = shallow(<IframeChallengesPopup {...mockProps} />);
    wrapper.instance().challengeNavigator = { onExitChallenges };
    wrapper.instance().onExitSco = jest.fn();

    // function under test
    wrapper.instance().onExitPopup();

    // expectations
    expect(onExitChallenges).toHaveBeenCalled();
    expect(wrapper.instance().onExitSco).not.toHaveBeenCalled();
  });

  test('method onExitSco() called after onExitChallenges', () => {
    // setup
    const onExitChallenges = jest.fn().mockReturnValue(false);
    const wrapper = shallow(<IframeChallengesPopup {...mockProps} />);
    wrapper.instance().challengeNavigator = { onExitChallenges };
    wrapper.instance().onExitSco = jest.fn();

    // function under test
    wrapper.instance().onExitPopup();

    // expectations
    expect(wrapper.instance().onExitSco).toHaveBeenCalled();
  });

  test('method onExitChallenges() not called', () => {
    // setup
    const onExitChallenges = jest.fn();
    const wrapper = shallow(<IframeChallengesPopup {...mockProps} />);
    wrapper.instance().onExitSco = jest.fn();

    // function under test
    wrapper.instance().onExitPopup();

    // expectations
    expect(onExitChallenges).not.toHaveBeenCalled();
    expect(wrapper.instance().onExitSco).toHaveBeenCalled();
  });
});
