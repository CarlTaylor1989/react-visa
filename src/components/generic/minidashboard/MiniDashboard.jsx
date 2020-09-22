import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Translate } from 'react-redux-i18n';
import ActionCreators from '../../../actions/index';
import Points from './Points';
import ChallengeStreak from './ChallengeStreak';
import Proposals from './Proposals';
import Rank from './Rank';
import ProductsCompleted from './ProductsCompleted';
import Achievements from './Achievements';
import Dashboard from '../dashboard/Dashboard';
import Tooltip from '../tooltip/Tooltip';

import './MiniDashboard.scss';

export class MiniDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayDashboard: false
    };
    this.onCloseDashboard = this.onCloseDashboard.bind(this);
    this.onDisplayDashboard = this.onDisplayDashboard.bind(this);
    this.onHoverBtn = this.onHoverBtn.bind(this);
  }

  onCloseDashboard() {
    this.setState({ displayDashboard: false });
  }

  onDisplayDashboard() {
    this.setState({ displayDashboard: true });
  }

  onHoverBtn() {
    const { setPlayAudio } = this.props;
    setPlayAudio('au6');
  }

  render() {
    const { displayDashboard } = this.state;
    return (
      <div className="miniDashboard">
        <div className="myDashboard">
          <div className="icon" />
          <Translate value="generic.miniDashboard.myDashboard" />
        </div>
        <Points animate />
        <ChallengeStreak />
        <Proposals />
        <Rank />
        <ProductsCompleted />
        <Achievements />
        <div className="more">
          <Tooltip fieldName="generic.tooltips.minidashboard.more">
            <button
              className="moreBtn"
              onClick={this.onDisplayDashboard}
              onMouseEnter={this.onHoverBtn}
              onTouchEnd={this.onHoverBtn}
              type="button"
            >
              <span className="icon" />
              <Translate value="generic.miniDashboard.moreBtn" />
            </button>
          </Tooltip>
        </div>
        <Dashboard
          displayDashboard={displayDashboard}
          closeDashboard={this.onCloseDashboard}
        />
      </div>
    );
  }
}

MiniDashboard.propTypes = {
  setPlayAudio: PropTypes.func.isRequired
};

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  null,
  mapDispatchToProps
)(MiniDashboard);
