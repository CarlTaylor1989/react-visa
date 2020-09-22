import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../../../actions/index';
import Points from '../minidashboard/Points';
import AchievementsView from './AchievementsView';
import RankView from './RankView';
import ProductsCompleteView from './ProductsCompleteView';
import modalSettings from '../../../config/modalsettings';
import Tooltip from '../tooltip/Tooltip';

import './Dashboard.scss';

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'achievements'
    };
  }

  getContent() {
    const { closeDashboard } = this.props;
    const { page } = this.state;
    let content;
    switch (page) {
      case 'achievements':
      default:
        content = <AchievementsView />;
        break;
      case 'rank':
        content = <RankView />;
        break;
      case 'productsCompleted':
        content = <ProductsCompleteView closePopup={closeDashboard} />;
        break;
    }
    return content;
  }

  setView(view) {
    this.setState({ page: view });
  }

  isSelected(view) {
    const { page } = this.state;
    return page === view ? 'selected' : '';
  }

  render() {
    const {
      displayDashboard,
      closeDashboard,
      setHintsPaused
    } = this.props;

    setHintsPaused(displayDashboard);
    const content = this.getContent();

    return (
      <Modal
        open={displayDashboard}
        classNames={{
          modal: 'dashboard',
          overlay: 'dashboardOverlay'
        }}
        container={document.getElementById('app')}
        onClose={closeDashboard}
        {...modalSettings}
      >
        <button
          type="button"
          className="exitPopup"
          onClick={closeDashboard}
        >
          <Translate value="generic.popupCloseBtn" />
        </button>
        <div className="popupWrapper">
          <div className="popupTitle">
            <Translate value="generic.dashboard.title" />
          </div>
          <div className="main">
            <div className="topBar">
              <div className="navigation">
                <Tooltip fieldName="generic.tooltips.dashboard.achievements.button">
                  <button
                    className={`achievementsBtn ${this.isSelected('achievements')}`}
                    onClick={() => this.setView('achievements')}
                    type="button"
                  >
                    <Translate value="generic.dashboard.achievementsBtn" />
                  </button>
                </Tooltip>
                <Tooltip fieldName="generic.tooltips.dashboard.rank.button">
                  <button
                    className={`rankBtn ${this.isSelected('rank')}`}
                    onClick={() => this.setView('rank')}
                    type="button"
                  >
                    <Translate value="generic.dashboard.rankBtn" />
                  </button>
                </Tooltip>
                <Tooltip fieldName="generic.tooltips.dashboard.products.button">
                  <button
                    className={`productsCompletedBtn ${this.isSelected('productsCompleted')}`}
                    onClick={() => this.setView('productsCompleted')}
                    type="button"
                  >
                    <Translate value="generic.dashboard.productsCompletedBtn" />
                  </button>
                </Tooltip>
              </div>
              <div className="pointsContainer">
                <Points />
              </div>
            </div>
            <div className="content">
              {content}
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

Dashboard.propTypes = {
  closeDashboard: PropTypes.func.isRequired,
  displayDashboard: PropTypes.bool.isRequired,
  setHintsPaused: PropTypes.func.isRequired
};

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  null,
  mapDispatchToProps
)(Dashboard);
