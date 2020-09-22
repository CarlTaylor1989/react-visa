import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Block from './Block';

import './Accordion.scss';

class Accordion extends Component {
  constructor(props) {
    super(props);
    const { open, children } = this.props;
    this.state = {
      prev: open,
      flags: new Array(React.Children.count(children)).fill(false).map(
        (val, index) => (index === open) // creates a boolean array with length set to the number of children and all items set to false except item at index props.open set to true
      )
    };
    this.onAccordionChange = this.onAccordionChange.bind(this);
  }

  onAccordionChange(index) {
    const newState = Object.assign({}, this.state);
    const { prev, flags } = this.state;
    if (
      prev !== index
      && prev !== null
      && flags[prev]
    ) {
      newState.flags[prev] = false;
    }
    newState.flags[index] = !flags[index];
    newState.prev = index;
    this.setState({ ...newState });
  }

  createBlocks(children) {
    const { flags } = this.state;

    return React.Children.map(children, (child, index) => (
      <Block
        title={child.props.title}
        className={child.props['data-custom-class']}
        selected={child.props['data-selected']}
        hasProduct={child.props['data-has-product']}
        isOpen={flags[index]}
        onToggle={() => this.onAccordionChange(index)}
      >
        {child}
      </Block>
    ));
  }

  render() {
    const { children, className } = this.props;
    const blocks = this.createBlocks(children);

    return (
      <div className={className}>
        {blocks}
      </div>
    );
  }
}

Accordion.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.number.isRequired,
  className: PropTypes.string
};

Accordion.defaultProps = {
  className: ''
};

export default Accordion;
