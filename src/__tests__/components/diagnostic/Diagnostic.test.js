/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import history from '../../../__mocks__/routerHistoryMock';
import { Diagnostic, mapStateToProps } from '../../../components/diagnostic/Diagnostic';
import {
  getAllRegions,
  getRegionsList,
  getSelectedRegion
} from '../../../components/diagnostic/regionselectors';
import { sendInteractionData } from '../../../tracking/xapi/XApiAdapter';

jest.mock('../../../components/diagnostic/regionselectors');
jest.mock('../../../tracking/xapi/XApiAdapter');

let mockProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockProps = {
    history,
    completed: false,
    commit: jest.fn(),
    diagnosticCompleted: false,
    lessonLocation: '',
    prepareSuspendData: jest.fn(),
    region: '',
    setCurrentHintGroup: jest.fn(),
    setDiagnosticCompletion: jest.fn(),
    setDiagnosticVisited: jest.fn(),
    setLessonLocation: jest.fn(),
    setPopupReferrer: jest.fn(),
    setRegion: jest.fn(),
    setScreenReferrer: jest.fn()
  };
});

test('renders the Diagnostic component with a disabled button', () => {
  const wrapper = shallow(<Diagnostic {...mockProps} />, {
    disableLifecycleMethods: true
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('renders the Diagnostic component with an enabled button', () => {
  const wrapper = shallow(<Diagnostic {...mockProps} region="eu" />, {
    disableLifecycleMethods: true
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidMount()', () => {
  const addEventListener = jest.fn();
  let regions;
  beforeEach(() => {
    regions = [{
      id: 'r1',
      addEventListener
    }, {
      id: 'r2',
      addEventListener
    }];
    getAllRegions.mockImplementation(() => regions);
  });

  test('registers the click event on all regions', () => {
    // setup
    const wrapper = shallow(<Diagnostic {...mockProps} />, {
      disableLifecycleMethods: true,
    });

    // function under test
    wrapper.instance().componentDidMount();

    // expectations
    expect(addEventListener).toHaveBeenCalledTimes(regions.length);
    expect(mockProps.setDiagnosticVisited).toHaveBeenCalled();
  });

  test('diagnostic already completed - no events registered', () => {
    // setup
    const wrapper = shallow(<Diagnostic {...mockProps} completed />, {
      disableLifecycleMethods: true,
    });

    // function under test
    wrapper.instance().componentDidMount();

    // expectations
    expect(addEventListener).not.toHaveBeenCalled();
    expect(mockProps.setDiagnosticVisited).toHaveBeenCalled();
  });
});

describe('method componentDidUpdate()', () => {
  test('method findAndGoToScreen() is not called', () => {
    const wrapper = shallow(<Diagnostic {...mockProps} />);
    wrapper.instance().findAndGoToScreen = jest.fn();
    wrapper.setProps({ completed: false });
    expect(wrapper.instance().findAndGoToScreen).not.toHaveBeenCalled();
  });

  test('method findAndGoToScreen() is called', () => {
    const wrapper = shallow(<Diagnostic {...mockProps} />);
    wrapper.instance().findAndGoToScreen = jest.fn();
    wrapper.setProps({ completed: true });
    expect(wrapper.instance().findAndGoToScreen).toHaveBeenCalled();
  });
});

test('method onNext()', () => {
  // setup
  const wrapper = shallow(<Diagnostic {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().sendTrackingData = jest.fn();

  // function under test
  wrapper.instance().onNext();

  // expectations
  expect(wrapper.instance().sendTrackingData).toHaveBeenCalledWith(expect.any(String));
  expect(mockProps.setDiagnosticCompletion).toHaveBeenCalled();
});

test('method sendTrackingData()', () => {
  // setup
  getRegionsList.mockImplementation(() => ({
    eu: {
      code: 'foo',
      name: 'bar'
    }
  }));
  const wrapper = shallow(<Diagnostic {...mockProps} />);

  // function under test
  wrapper.instance().sendTrackingData('eu');

  // expectation
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: expect.any(String),
    activity: expect.objectContaining({
      id: expect.any(String),
      type: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      choices: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          description: expect.any(String)
        })
      ])
    }),
    result: expect.objectContaining({
      completion: true
    }),
    response: expect.objectContaining({
      detail: expect.any(String),
      timeAvailable: expect.any(Date),
      timeResponse: expect.any(Date)
    }),
    parent: expect.any(String)
  }));
});

describe('method onRegionSelect()', () => {
  let add;
  let event;
  beforeEach(() => {
    add = jest.fn();
    event = {
      currentTarget: {
        getAttribute: jest.fn().mockReturnValue('eu'),
        classList: { add }
      }
    };
  });

  test('sets the selected region for first time', () => {
    // setup
    const wrapper = shallow(<Diagnostic {...mockProps} />, {
      disableLifecycleMethods: true
    });

    // function under test
    wrapper.instance().onRegionSelect(event);

    // expectations
    expect(add).toHaveBeenCalled();
    expect(wrapper.instance().state.selectedRegion).toEqual(expect.any(String));
  });

  test('sets the selected region and unselects the previous selection', () => {
    // setup
    const remove = jest.fn();
    const el = [{
      classList: {
        remove
      }
    }];
    getSelectedRegion.mockImplementation(() => el);
    const wrapper = shallow(<Diagnostic {...mockProps} />, {
      disableLifecycleMethods: true
    });

    // function under test
    wrapper.instance().onRegionSelect(event);

    // expectations
    expect(add).toHaveBeenCalled();
    expect(remove).toHaveBeenCalled();
    expect(wrapper.instance().state.selectedRegion).toEqual(expect.any(String));
  });

  test('region already selected - event ignored', () => {
    // setup
    const wrapper = shallow(<Diagnostic {...mockProps} region="eu" />, {
      disableLifecycleMethods: true
    });

    // function under test
    wrapper.instance().onRegionSelect(event);

    // expectations
    expect(add).not.toHaveBeenCalled();
  });
});

test('should mapStateToProps', () => {
  const state = {
    diagnosticData: {
      completed: true,
      region: 'eu'
    }
  };
  const props = mapStateToProps(state);
  expect(props).toEqual({
    ...state.diagnosticData
  });
});
