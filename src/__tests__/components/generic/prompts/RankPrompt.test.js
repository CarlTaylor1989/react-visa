/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import RankPrompt from '../../../../components/generic/prompts/RankPrompt';

let mockProps;
beforeEach(() => {
  mockProps = {
    rankId: 'r1',
    setPlayAudio: jest.fn()
  };
});

test('renders the RankPrompt', () => {
  const wrapper = shallow(<RankPrompt {...mockProps} />, {
    disableLifecycleMethods: true
  });
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

describe('method componentDidUpdate()', () => {
  test('achievement changed', () => {
    // setup
    const wrapper = shallow(<RankPrompt {...mockProps} />);
    wrapper.instance().playAudio = jest.fn();
    wrapper.setProps({ rankId: 'ac2' });

    // function under test
    wrapper.update();

    // expectation
    expect(mockProps.setPlayAudio).toHaveBeenCalledWith(expect.any(String));
  });

  test('rank remains the same', () => {
    // setup
    const wrapper = shallow(<RankPrompt {...mockProps} />);
    wrapper.instance().playAudio = jest.fn();
    wrapper.setProps({ rankId: '' });

    // function under test
    wrapper.update();

    // expectation
    expect(wrapper.instance().playAudio).not.toHaveBeenCalled();
  });
});

test('method playAudio()', () => {
  const wrapper = shallow(<RankPrompt {...mockProps} />, {
    disableLifecycleMethods: true
  });
  wrapper.instance().playAudio();
  expect(mockProps.setPlayAudio).toHaveBeenCalledWith(expect.any(String));
});
