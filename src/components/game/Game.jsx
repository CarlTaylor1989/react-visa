import React from 'react';
import PropTypes from 'prop-types';
import {
  NavLink,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import { Translate } from 'react-redux-i18n';
import { GoToScreen, newScreenConnect } from '../generic/GoToScreen';
import Network from './network/Network';
import ClientProposals from './clientproposals/ClientProposals';
import FooterBar from '../generic/footerbar/FooterBar';
import MiniDashboard from '../generic/minidashboard/MiniDashboard';
import Prompts from '../generic/prompts/Prompts';
import TutorialPopup from '../generic/tutorialpopup/TutorialPopup';
import FeedbackPopup from '../generic/feedbackPopup/FeedbackPopup';
import { networkPath, networkMapPath, clientsPropsPath } from '../../config/navigation';
import { getLocationTutorialSlideIndex } from '../../lib/tutorial';
import { FEEDBACK_TRIGGER } from '../../config/constants';

import './Game.scss';

export class Game extends GoToScreen {
  constructor(props) {
    super(props);
    this.state = {
      displayHelpPopup: false,
      displayFeedbackPopup:
        !props.feedbackDisabled
        && props.feedbackTriggered
        && (props.feedbackDays === FEEDBACK_TRIGGER)
    };

    this.isNetworkBtnActive = this.isNetworkBtnActive.bind(this);
    this.isClientBtnActive = this.isClientBtnActive.bind(this);
    this.onCloseHelpPopup = this.onCloseHelpPopup.bind(this);
    this.onCloseFeedbackPopup = this.onCloseFeedbackPopup.bind(this);
    this.onDisplayHelpPopup = this.onDisplayHelpPopup.bind(this);
    this.onDisplayFeedbackPopup = this.onDisplayFeedbackPopup.bind(this);
  }

  componentDidMount() {
    const { disableFeedback } = this.props;
    const { displayFeedbackPopup } = this.state;

    if (displayFeedbackPopup) {
      this.onDisplayFeedbackPopup();
      disableFeedback();
    }
  }

  isNetworkBtnActive() {
    return this.checkForChildPaths(networkPath);
  }

  isClientBtnActive() {
    return this.checkForChildPaths(clientsPropsPath);
  }

  checkForChildPaths(parentPath) {
    const { location } = this.props;
    return String(location.pathname).includes(parentPath);
  }

  onCloseHelpPopup() {
    this.setState({ displayHelpPopup: false });
  }

  onCloseFeedbackPopup() {
    this.setState({ displayFeedbackPopup: false });
  }

  onDisplayHelpPopup() {
    const { location, setTutorialSlideIndex } = this.props;
    const tutorialSlideIndex = getLocationTutorialSlideIndex(location.pathname);
    setTutorialSlideIndex(tutorialSlideIndex);
    this.setState({ displayHelpPopup: true });
  }

  onDisplayFeedbackPopup() {
    this.setState({ displayFeedbackPopup: true });
  }

  render() {
    const { displayHelpPopup, displayFeedbackPopup } = this.state;
    return (
      <div className="game">
        <div className="logo" />
        <div className="decor stars" />
        <div className="decor circlesTop" />
        <div className="decor circlesBottom" />
        <div className="vuLogo" />

        <div className="navButtons">
          <NavLink
            to={`${clientsPropsPath}`}
            className="clientPropsBtn"
            activeClassName="selected"
            isActive={this.isNetworkBtisClientBtnActivenActive}
            onMouseEnter={this.onHoverBtn}
            onTouchEnd={this.onHoverBtn}
          >
            <span className="icon" />
            <Translate value="clientprops.clientPropsBtn" />
          </NavLink>
          <NavLink
            to={`${networkMapPath}`}
            className="productNetworkBtn"
            activeClassName="selected"
            isActive={this.isNetworkBtnActive}
            onMouseEnter={this.onHoverBtn}
            onTouchEnd={this.onHoverBtn}
          >
            <span className="icon" />
            <Translate value="network.productNetworkBtn" />
          </NavLink>
        </div>
        <button
          type="button"
          className="helpBtn"
          onClick={this.onDisplayHelpPopup}
          onMouseEnter={this.onHoverBtn}
          onTouchEnd={this.onHoverBtn}
        >
          <Translate className="text" value="generic.helpBtn" />
          <span className="icon" />
        </button>

        <Switch>
          <Route path={`${networkPath}`} component={Network} />
          <Route path={`${clientsPropsPath}`} component={ClientProposals} />
          <Redirect to={`${clientsPropsPath}`} />
        </Switch>
        <MiniDashboard />
        <TutorialPopup
          showPopup={displayHelpPopup}
          closePopup={this.onCloseHelpPopup}
        />
        <FeedbackPopup
          showPopup={displayFeedbackPopup}
          closePopup={this.onCloseFeedbackPopup}
        />
        <FooterBar changeRegion={this.onChangeRegion} />
        <Prompts />
      </div>
    );
  }
}

Game.propTypes = {
  disableFeedback: PropTypes.func.isRequired,
  feedbackTriggered: PropTypes.bool.isRequired,
  feedbackDays: PropTypes.number.isRequired,
  feedbackDisabled: PropTypes.bool.isRequired,
  setTutorialSlideIndex: PropTypes.func.isRequired
};

export const mapStateToProps = state => ({
  feedbackTriggered: state.genericData.feedback.triggered,
  feedbackDays: state.genericData.feedback.days,
  feedbackDisabled: state.genericData.feedback.disabled
});

export default newScreenConnect(Game, mapStateToProps);
