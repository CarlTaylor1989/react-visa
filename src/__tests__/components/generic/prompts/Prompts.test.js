/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  Prompts,
  mapStateToProps,
  mapDispatchToProps
} from '../../../../components/generic/prompts/Prompts';
import * as hintsActions from '../../../../actions/hints';
import * as promptsActions from '../../../../actions/prompts';
import * as hintTypes from '../../../../actions/hintsTypes';
import * as promptsTypes from '../../../../actions/promptTypes';
import {
  ACHIEVEMENT_PROMPT,
  PRODUCT_PROMPT,
  RANK_PROMPT,
  BONUS_STREAK_PROMPT
} from '../../../../config/constants';

let mockProps;
beforeEach(() => {
  mockProps = {
    achievements: [],
    bonusStreak: 0,
    categories: {
      achievements: 0,
      products: 1
    },
    displayPrompts: false,
    paused: false,
    productFamily: 'm1f2',
    productMap: 'm1',
    products: [],
    ranks: [],
    resetAchievementPrompts: jest.fn(),
    resetBonusStreakPrompt: jest.fn(),
    resetDisplayedPrompts: jest.fn(),
    resetProductPrompt: jest.fn(),
    resetRankPrompt: jest.fn(),
    setDisplayPrompts: jest.fn(),
    setHintsPaused: jest.fn(),
    setPlayAudio: jest.fn()
  };
});

test('renders a closed popup', () => {
  const wrapper = shallow(<Prompts {...mockProps} />, {
    disableLifecycleMethods: true,
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidMount()', () => {
  test('prompts are not set', () => {
    const wrapper = shallow(<Prompts {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().setPrompts = jest.fn();
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().setPrompts).not.toHaveBeenCalled();
  });

  test('prompts are set', () => {
    const wrapper = shallow(<Prompts {...mockProps} displayPrompts />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().setPrompts = jest.fn();
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().setPrompts).toHaveBeenCalled();
  });
});

describe('method componentDidUpdate()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Prompts {...mockProps} />);
    wrapper.instance().setPrompts = jest.fn();
  });

  test('calls method setPrompts() while paused is set to false', () => {
    wrapper.setProps({
      displayPrompts: true
    });
    wrapper.update();
    expect(wrapper.instance().setPrompts).toHaveBeenCalled();
  });

  test('calls method setPrompts() while paused is set to true', () => {
    wrapper = shallow(<Prompts {...mockProps} paused />);
    wrapper.instance().setPrompts = jest.fn();
    wrapper.setProps({
      displayPrompts: true,
      paused: false
    });
    wrapper.update();
    expect(wrapper.instance().setPrompts).toHaveBeenCalled();
  });

  test('method setPrompts() is not called', () => {
    wrapper.setProps({
      displayPrompts: false
    });
    wrapper.update();
    expect(wrapper.instance().setPrompts).not.toHaveBeenCalled();
  });
});

test('method onClosePrompt()', () => {
  const wrapper = shallow(<Prompts {...mockProps} />, {
    disableLifecycleMethods: true,
  });
  wrapper.instance().onClosePrompt();
  expect(wrapper.instance().state.displayPrompt).toBeFalsy();
});

describe('method onDisplayPrompt()', () => {
  test('state without any prompts', () => {
    const wrapper = shallow(<Prompts {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().onDisplayPrompt(0, []);
    expect(wrapper.instance().state).toEqual(expect.objectContaining({
      displayPrompt: true,
      index: 0
    }));
  });

  test('state with prompts', () => {
    const wrapper = shallow(<Prompts {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().onDisplayPrompt(0, [{ foo: 'bar' }]);
    expect(wrapper.instance().state).toEqual(expect.objectContaining({
      displayPrompt: true,
      index: 0,
      prompts: expect.any(Object)
    }));
  });
});

describe('method onExitPrompt()', () => {
  test('setHintsPaused is called with false', () => {
    // setup
    const wrapper = shallow(<Prompts {...mockProps} />, {
      disableLifecycleMethods: true,
    });

    wrapper.instance().setState({
      index: 1,
      prompts: [{ type: 'foo' }, { type: 'bar' }]
    });

    // function under test
    wrapper.instance().onExitPrompt();

    // expectation
    expect(mockProps.setHintsPaused).toHaveBeenCalledWith(false);
  });

  test('removes prompts and resets the state', () => {
    // setup
    const wrapper = shallow(<Prompts {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().removePrompts = jest.fn();
    wrapper.instance().setState({
      index: 1,
      prompts: [{ type: 'foo' }, { type: 'bar' }]
    });

    // function under test
    wrapper.instance().onExitPrompt();

    // expectations
    expect(wrapper.instance().removePrompts).toHaveBeenCalledWith(expect.any(String));
    expect(wrapper.instance().state).toEqual(expect.objectContaining({
      index: 0,
      prompts: []
    }));
  });

  test('removes prompts and displays next type prompt', () => {
    // setup
    const wrapper = shallow(<Prompts {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    const prompts = [{ type: 'foo' }, { type: 'bar' }];
    wrapper.instance().onDisplayPrompt = jest.fn();
    wrapper.instance().removePrompts = jest.fn();
    wrapper.instance().setState({
      index: 0,
      prompts
    });

    // function under test
    wrapper.instance().onExitPrompt();

    // expectations
    expect(wrapper.instance().onDisplayPrompt).toHaveBeenCalledWith(1, prompts);
    expect(wrapper.instance().removePrompts).toHaveBeenCalledWith(expect.any(String));
  });

  test('displays next prompt with the same type', () => {
    // setup
    const wrapper = shallow(<Prompts {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    const prompts = [{ type: 'foo' }, { type: 'foo' }];
    wrapper.instance().onDisplayPrompt = jest.fn();
    wrapper.instance().removePrompts = jest.fn();
    wrapper.instance().setState({
      index: 0,
      prompts
    });

    // function under test
    wrapper.instance().onExitPrompt();

    // expectations
    expect(wrapper.instance().onDisplayPrompt).toHaveBeenCalledWith(1, prompts);
    expect(wrapper.instance().removePrompts).not.toHaveBeenCalled();
  });
});

describe('method setPrompts()', () => {
  test('no prompts found and summary prompt not shown', () => {
    // setup
    const wrapper = shallow(<Prompts {...mockProps} categories={{}} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().onDisplayPrompt = jest.fn();

    // function under test
    wrapper.instance().setPrompts();

    // expectation
    expect(wrapper.instance().onDisplayPrompt).not.toHaveBeenCalled();
    expect(wrapper.instance().state.summaryPrompt).toBeFalsy();
  });

  test('no prompts found and summary prompt is shown', () => {
    // setup
    const wrapper = shallow(<Prompts {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().onDisplayPrompt = jest.fn();

    // function under test
    wrapper.instance().setPrompts();

    // expectation
    expect(wrapper.instance().onDisplayPrompt).not.toHaveBeenCalled();
    expect(wrapper.instance().state.summaryPrompt).toBeTruthy();
  });

  test('prompts with achievements', () => {
    // setup
    mockProps.achievements = ['ac1'];
    const wrapper = shallow(<Prompts {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().onDisplayPrompt = jest.fn();

    // function under test
    wrapper.instance().setPrompts();

    // expectation
    expect(wrapper.instance().onDisplayPrompt).toHaveBeenCalledWith(
      0,
      expect.arrayContaining([expect.objectContaining({
        id: expect.any(String),
        type: ACHIEVEMENT_PROMPT
      })])
    );
  });

  test('prompts with ranks', () => {
    // setup
    mockProps.ranks = ['r1'];
    const wrapper = shallow(<Prompts {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().onDisplayPrompt = jest.fn();

    // function under test
    wrapper.instance().setPrompts();

    // expectation
    expect(wrapper.instance().onDisplayPrompt).toHaveBeenCalledWith(
      0,
      expect.arrayContaining([expect.objectContaining({
        id: expect.any(String),
        type: RANK_PROMPT
      })])
    );
  });

  test('prompts with a product', () => {
    // setup
    mockProps.products = ['p3'];
    const wrapper = shallow(<Prompts {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().onDisplayPrompt = jest.fn();

    // function under test
    wrapper.instance().setPrompts();

    // expectation
    expect(wrapper.instance().onDisplayPrompt).toHaveBeenCalledWith(
      0,
      expect.arrayContaining([expect.objectContaining({
        id: expect.any(String),
        family: expect.any(String),
        map: expect.any(String),
        type: PRODUCT_PROMPT,
      })])
    );
  });

  test('bonus streak prompt', () => {
    // setup
    mockProps.bonusStreak = 1;
    const wrapper = shallow(<Prompts {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().onDisplayPrompt = jest.fn();

    // function under test
    wrapper.instance().setPrompts();

    // expectation
    expect(wrapper.instance().onDisplayPrompt).toHaveBeenCalledWith(
      0,
      expect.arrayContaining([expect.objectContaining({
        type: BONUS_STREAK_PROMPT
      })])
    );
  });

  test('setHintsPaused is called with true', () => {
    // setup
    mockProps.achievements = ['ac1'];
    const wrapper = shallow(<Prompts {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().onDisplayPrompt = jest.fn();

    // function under test
    wrapper.instance().setPrompts();

    // expectation
    expect(mockProps.setHintsPaused).toHaveBeenCalledWith(true);
  });
});

test('method closeSummaryPrompt()', () => {
  const wrapper = shallow(<Prompts {...mockProps} />, {
    disableLifecycleMethods: true,
  });
  wrapper.instance().closeSummaryPrompt();
  expect(wrapper.instance().state.summaryPrompt).toBeFalsy();
});

describe('method displayPrompts()', () => {
  test('no prompts found', () => {
    const wrapper = shallow(<Prompts {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().displayPrompts();
    expect(wrapper.instance().state.displayPrompt).toBeFalsy();
  });

  test('displays prompts', () => {
    const wrapper = shallow(<Prompts {...mockProps} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().setState({ prompts: ['foo'] });
    wrapper.instance().displayPrompts();
    expect(wrapper.instance().state.displayPrompt).toBeTruthy();
  });
});

describe('method removePrompts()', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Prompts {...mockProps} />, {
      disableLifecycleMethods: true,
    });
  });

  test('no prompts are removed', () => {
    wrapper.instance().removePrompts('');
    expect(mockProps.resetAchievementPrompts).not.toHaveBeenCalled();
    expect(mockProps.resetRankPrompt).not.toHaveBeenCalled();
  });

  test('all achievements prompts are removed', () => {
    wrapper.instance().removePrompts(ACHIEVEMENT_PROMPT);
    expect(mockProps.resetAchievementPrompts).toHaveBeenCalled();
    expect(mockProps.resetProductPrompt).not.toHaveBeenCalled();
    expect(mockProps.resetRankPrompt).not.toHaveBeenCalled();
    expect(mockProps.resetBonusStreakPrompt).not.toHaveBeenCalled();
  });

  test('all product prompts are removed', () => {
    wrapper.instance().removePrompts(PRODUCT_PROMPT);
    expect(mockProps.resetAchievementPrompts).not.toHaveBeenCalled();
    expect(mockProps.resetProductPrompt).toHaveBeenCalled();
    expect(mockProps.resetRankPrompt).not.toHaveBeenCalled();
    expect(mockProps.resetBonusStreakPrompt).not.toHaveBeenCalled();
  });

  test('all rank prompts are removed', () => {
    wrapper.instance().removePrompts(RANK_PROMPT);
    expect(mockProps.resetAchievementPrompts).not.toHaveBeenCalled();
    expect(mockProps.resetProductPrompt).not.toHaveBeenCalled();
    expect(mockProps.resetRankPrompt).toHaveBeenCalled();
    expect(mockProps.resetBonusStreakPrompt).not.toHaveBeenCalled();
  });

  test('bonus streak prompt removed', () => {
    wrapper.instance().removePrompts(BONUS_STREAK_PROMPT);
    expect(mockProps.resetAchievementPrompts).not.toHaveBeenCalled();
    expect(mockProps.resetProductPrompt).not.toHaveBeenCalled();
    expect(mockProps.resetRankPrompt).not.toHaveBeenCalled();
    expect(mockProps.resetBonusStreakPrompt).toHaveBeenCalled();
  });
});

test('should mapStateToProps', () => {
  // setup
  const state = {
    mapData: {
      currentMap: '',
      currentFamily: '',
    },
    promptsData: {
      achievements: [],
      bonusStreak: 0,
      products: [],
      paused: false,
      ranks: [],
      show: false
    },
    scoreData: {
      categories: {}
    }
  };
  const expected = {
    achievements: state.promptsData.achievements,
    bonusStreak: state.promptsData.bonusStreak,
    displayPrompts: state.promptsData.show,
    paused: state.promptsData.paused,
    productFamily: state.mapData.currentFamily,
    productMap: state.mapData.currentMap,
    products: state.promptsData.products,
    ranks: state.promptsData.ranks,
    ...state.scoreData
  };

  // function under test
  const props = mapStateToProps(state);

  // expectation
  expect(props).toEqual(expected);
});

describe('describe mapDispatchToProps', () => {
  test('RESET_ACHIEVEMENT_PROMPTS', () => {
    const dispatch = jest.fn();
    jest.spyOn(promptsActions, 'resetAchievementPrompts')
      .mockReturnValue('resetAchievementPrompts()');
    const props = mapDispatchToProps(dispatch);
    props.resetAchievementPrompts();
    expect(dispatch).toHaveBeenCalledWith({
      type: promptsTypes.RESET_ACHIEVEMENT_PROMPTS
    });
  });

  test('SET_HINTS_PAUSED', () => {
    const dispatch = jest.fn();
    jest.spyOn(hintsActions, 'setHintsPaused').mockReturnValue('setHintsPaused()');
    const props = mapDispatchToProps(dispatch);
    props.setHintsPaused();
    expect(dispatch).toHaveBeenCalledWith({
      type: hintTypes.SET_HINTS_PAUSED
    });
  });
});
