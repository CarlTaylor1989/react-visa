import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './TutorialTab.scss';

class TutorialTab extends Component {
  constructor(props) {
    super(props);
    this.onTabSelect = this.onTabSelect.bind(this);
  }

  onTabSelect() {
    const { onTabSelect, sectionIndices } = this.props;
    onTabSelect(sectionIndices[0]);
  }

  render() {
    const { label, sectionIndices, slideIndex } = this.props;
    const indexInRange = slideIndex >= sectionIndices[0] && slideIndex <= sectionIndices[1];

    return (
      <button
        type="button"
        className={`tutorialTab ${indexInRange ? 'selected' : ''}`}
        onClick={this.onTabSelect}
      >
        {label}
      </button>
    );
  }
}

TutorialTab.propTypes = {
  label: PropTypes.string.isRequired,
  onTabSelect: PropTypes.func.isRequired,
  slideIndex: PropTypes.number.isRequired,
  sectionIndices: PropTypes.arrayOf(PropTypes.number).isRequired
};

export default TutorialTab;
