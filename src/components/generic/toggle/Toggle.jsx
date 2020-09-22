import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';

import './Toggle.scss';

class Toggle extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    const { handleChange, checked } = this.props;
    handleChange(!checked);
  }

  render() {
    const { checked } = this.props;
    const className = checked ? ' checked' : '';
    return (
      <div className="toggleWrapper">
        <Translate className="toggleText" value="generic.switchOn" />
        <button
          className={`toggleSwitch${className}`}
          onClick={this.onChange}
          type="button"
        />
        <Translate className="toggleText" value="generic.switchOff" />
      </div>
    );
  }
}

Toggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default Toggle;
