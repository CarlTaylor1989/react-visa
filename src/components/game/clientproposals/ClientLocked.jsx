import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { bindActionCreators } from 'redux';
import ActionCreators from '../../../actions/index';
import CircularProgressBar from '../../generic/circularprogressbar/CircularProgressBar';
import { getRemainingLockedDuration } from '../../../lib/clients';
import { CLIENT_IN_PROGRESS } from '../../../config/constants';

import './ClientLocked.scss';

export class ClientLocked extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percentage: 100,
      minutes: 1
    };

    this.timer = null;
    this.ticks = 0;
    this.maxTicks = 0;
    this.duration = 0;

    this.timerCallback = this.timerCallback.bind(this);
  }

  componentDidMount() {
    const { locked, tickEvery } = this.props;
    const remaining = getRemainingLockedDuration(locked.start, locked.duration);
    this.duration = locked.duration;
    this.maxTicks = this.duration / tickEvery;
    this.ticks = (this.duration - remaining) / tickEvery;
    this.setValues();
    this.timer = setInterval(this.timerCallback, tickEvery * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  setValues() {
    const { tickEvery } = this.props;
    this.setState({
      minutes: (this.duration / 60) - Math.floor((this.ticks * tickEvery) / 60),
      percentage: 100 - Math.ceil((this.ticks / this.maxTicks) * 100)
    });
  }

  timerCallback() {
    const { client, setClientStatus, unlockClient } = this.props;
    this.ticks += 1;
    this.setValues();

    if (this.ticks >= this.maxTicks) {
      clearInterval(this.timer);
      unlockClient(client);
      setClientStatus(client, CLIENT_IN_PROGRESS);
    }
  }

  render() {
    const { minutes, percentage } = this.state;
    return (
      <div className="clientLocked">
        <span className="padlock" />
        <CircularProgressBar percentage={percentage} />
        <div className="lockTimer">
          <span className="clock" />
          {minutes > 1 ? (
            <Translate
              className="text"
              number={minutes}
              value="clientprops.lockedSeveral"
            />
          ) : (
            <Translate className="text" value="clientprops.lockedSingle" />
          )}
        </div>
      </div>
    );
  }
}

ClientLocked.defaultProps = {
  tickEvery: 1
};

ClientLocked.propTypes = {
  locked: PropTypes.object.isRequired,
  client: PropTypes.string.isRequired,
  tickEvery: PropTypes.number,
  setClientStatus: PropTypes.func.isRequired,
  unlockClient: PropTypes.func.isRequired
};

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  null,
  mapDispatchToProps
)(ClientLocked);
