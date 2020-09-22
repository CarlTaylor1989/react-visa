/* global toJson */
import React from 'react'; // eslint-disable-line no-unused-vars
import Accordion from '../../../../components/generic/accordion/Accordion';
import Block from '../../../../components/generic/accordion/Block';

let mockProps;
beforeEach(() => {
  mockProps = {
    open: 1,
    children: ([
      <div title="first_item" data-has-product>
        <p>Paragraph of text for first item.</p>
      </div>,
      <div title="second_item" data-has-product>
        <p>Paragraph of text for second item.</p>
      </div>,
      <div title="third_item" data-has-product={false} />
    ])
  };
});

test('renders the Accordion component', () => {
  const wrapper = shallow(<Accordion {...mockProps} />);
  expect(toJson(wrapper, { noKey: false })).toMatchSnapshot();
});

test('sets initial state', () => {
  const wrapper = shallow(<Accordion {...mockProps} />);
  const finalState = {
    prev: 1,
    flags: [false, true, false]
  };
  expect(wrapper.instance().state).toStrictEqual(finalState);
});

test('sets initial state without product', () => {
  const wrapper = shallow(<Accordion {...mockProps} />);
  const finalState = {
    prev: 1,
    flags: [false, true, false]
  };
  expect(wrapper.instance().state).toStrictEqual(finalState);
});

describe('method onAccordionChange()', () => {
  test('sets the previous flag to false', () => {
    // setup
    const wrapper = shallow(<Accordion {...mockProps} />);
    wrapper.instance().setState({
      prev: 0,
      flags: [true, false, false]
    });
    const finalState = {
      prev: 2,
      flags: [false, false, true]
    };

    // function under test
    wrapper.instance().onAccordionChange(2);

    // expectation
    expect(wrapper.instance().state).toStrictEqual(finalState);
  });

  test('sets the current flag to true', () => {
    // setup
    const wrapper = shallow(<Accordion {...mockProps} />);
    wrapper.instance().setState({
      prev: 0,
      flags: [false, false, false]
    });
    const finalState = {
      prev: 0,
      flags: [true, false, false]
    };

    // function under test
    wrapper.instance().onAccordionChange(0);

    // expectation
    expect(wrapper.instance().state).toStrictEqual(finalState);
  });
});

test('method accordion block toggled', () => {
  const wrapper = shallow(<Accordion {...mockProps} />);
  wrapper.instance().onAccordionChange = jest.fn();

  // function under test
  wrapper.find(Block).at(0).props().onToggle();

  // expectation
  expect(wrapper.instance().onAccordionChange).toHaveBeenCalledWith(0);
});
