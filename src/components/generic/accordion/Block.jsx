import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import Collapse from '@kunukn/react-collapse';

import './Accordion.scss';

const Block = ({
  isOpen, title, onToggle, children, className, selected, hasProduct
}) => (
  <div className="accordionItem">
    <button
      className={`toggleButton ${className}`}
      type="button"
      onClick={() => (hasProduct ? onToggle() : null)}
    >
      <span className="accordionItemTitle">
        {title}
      </span>
      <div className="selectedNumberIndicatorWrapper">
        {selected.map(sel => <span key={sel} className="selectedNumberIndicator" />)}
      </div>
      {hasProduct && <span className={`icon-down ${isOpen ? 'is-open' : ''}`} /> }
    </button>
    <Collapse isOpen={isOpen}>{children}</Collapse>
    <span>{children.length}</span>
  </div>
);

Block.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  selected: PropTypes.array,
  className: PropTypes.string,
  hasProduct: PropTypes.bool.isRequired
};

Block.defaultProps = {
  className: '',
  selected: []
};

export default Block;
