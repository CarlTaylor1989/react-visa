import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import ActionCreators from '../../../actions/index';
import {
  CLIENT_NOT_STARTED,
  CLIENT_IN_PROGRESS,
  CLIENT_COMPLETED,
  CLIENT_GIVENUP
} from '../../../config/constants';
import { proposalPath } from '../../../config/navigation';

import './ClientInfoButtons.scss';

export class ClientInfoButtons extends Component {
  constructor(props) {
    super(props);
    this.onStartClient = this.onStartClient.bind(this);
    this.onResumeClient = this.onResumeClient.bind(this);
  }

  onStartClient() {
    const { client, setClientStatus } = this.props;
    setClientStatus(client, CLIENT_IN_PROGRESS);
    this.onResumeClient();
  }

  onResumeClient() {
    const { client, setClientShowing } = this.props;
    setClientShowing(client);
  }

  render() {
    const { status } = this.props;
    return (
      <div className="clientInfoButtons">
        {(() => {
          switch (status) {
            case CLIENT_NOT_STARTED:
              return (
                <div className="startClient">
                  <NavLink
                    type="button"
                    className="startBtn"
                    to={`${proposalPath}`}
                    onClick={this.onStartClient}
                  >
                    <Translate value="clientprops.info.startBtn" />
                  </NavLink>
                </div>
              );
            case CLIENT_COMPLETED:
              return (
                <div className="reviewClient">
                  <NavLink
                    type="button"
                    className="reviewBtn"
                    to={`${proposalPath}`}
                    onClick={this.onResumeClient}
                  >
                    <Translate value="clientprops.info.reviewBtn" />
                  </NavLink>
                </div>
              );
            case CLIENT_GIVENUP:
              return (
                <div className="reviewClient">
                  <NavLink
                    type="button"
                    className="reviewBtn"
                    to={`${proposalPath}`}
                    onClick={this.onResumeClient}
                  >
                    <Translate value="clientprops.info.reviewBtn" />
                  </NavLink>
                </div>
              );
            default:
              return (
                <div className="resumeClient">
                  <NavLink
                    type="button"
                    className="resumeBtn"
                    to={`${proposalPath}`}
                    onClick={this.onResumeClient}
                  >
                    <Translate value="clientprops.info.resumeBtn" />
                  </NavLink>
                </div>
              );
          }
        })()}
      </div>
    );
  }
}

ClientInfoButtons.propTypes = {
  client: PropTypes.string.isRequired,
  setClientShowing: PropTypes.func.isRequired,
  setClientStatus: PropTypes.func.isRequired,
  status: PropTypes.number.isRequired
};

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  null,
  mapDispatchToProps
)(ClientInfoButtons);
