import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { I18n, Translate } from 'react-redux-i18n';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import ClientAvatar from '../ClientAvatar';
import ProposalClientIcon from './ProposalClientIcon';
import ResourcesPanel from './ResourcesPanel';
import SolutionFeedback from './solutionfeedback/SolutionFeedback';
import SolutionsPanel from './SolutionsPanel';
import Requirements from './Requirements';
import RequirementFeedback from './RequirementFeedback';
import ActionCreators from '../../../../actions/index';
import Tooltip from '../../../generic/tooltip/Tooltip';
import { CLIENT_COMPLETED, CLIENT_GIVENUP, CLIENT_LOCKED } from '../../../../config/constants';
import { clientsSelectorPath } from '../../../../config/navigation';
import { clientsPropsReferrer } from '../../../../config/referrers';
import { getUnloadEventName } from '../../../../lib/app';
import { getClientDifficultyScore } from '../../../../lib/clients';
import { sendInteractionData } from '../../../../tracking/xapi/XApiAdapter';
import { HINT_CLIENT_PROPOSAL } from '../../../../config/hints';

import './ProposalPage.scss';

export class ProposalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      correctRequirements: Boolean(props.clientData && props.clientData.reqCorrect),
      correctSolutions: Boolean(props.clientData && props.clientData.solutionCorrect),
      clientShowing: props.clientShowing,
      forceTooltipHide: false,
      isResourcePopupOpen: false,
      selectedResourceType: '',
      selectedResourceId: ''
    };

    this.timeAvailable = null;
    this.onCorrectRequirements = this.onCorrectRequirements.bind(this);
    this.onCorrectSolutions = this.onCorrectSolutions.bind(this);
    this.onLockClient = this.onLockClient.bind(this);
    this.onLockedRequirements = this.onLockedRequirements.bind(this);
    this.onGoBack = this.onGoBack.bind(this);
    this.openResourcePopup = this.openResourcePopup.bind(this);
    this.closeResourcePopup = this.closeResourcePopup.bind(this);
    this.onSolutionExited = this.onSolutionExited.bind(this);
    this.onSolutionOpen = this.onSolutionOpen.bind(this);
  }

  componentDidMount() {
    const { clientData, displaySolutionFeedback, setCurrentHintGroup } = this.props;
    this.timeAvailable = new Date();
    setCurrentHintGroup(HINT_CLIENT_PROPOSAL);
    window.addEventListener(getUnloadEventName(), this.sendPageStatement);

    if (clientData
      && (clientData.status === CLIENT_COMPLETED || clientData.status === CLIENT_GIVENUP)) {
      displaySolutionFeedback();
    }
  }

  componentWillUnmount() {
    const { hideRequirementFeedback, hideSolutionFeedback } = this.props;
    hideRequirementFeedback();
    hideSolutionFeedback();
    this.sendPageStatement();
    window.removeEventListener(getUnloadEventName(), this.sendPageStatement);
  }

  onCorrectRequirements() {
    const { hideRequirementFeedback } = this.props;
    hideRequirementFeedback();
    this.setState({ correctRequirements: true });
  }

  onCorrectSolutions() {
    const { hideSolutionFeedback } = this.props;
    hideSolutionFeedback();
    this.setState({ correctSolutions: true });
  }

  onLockedRequirements() {
    const { push, setClientShowing } = this.props;
    push(clientsSelectorPath);
    setClientShowing('');
  }

  onLockClient() {
    const { setClientStatus } = this.props;
    const { clientShowing } = this.state;
    setClientStatus(clientShowing, CLIENT_LOCKED);
  }

  onGoBack() {
    this.setState({
      forceTooltipHide: true
    });
  }

  onSolutionExited() {
    const { setPromptsPaused } = this.props;
    setPromptsPaused(false);
  }

  onSolutionOpen() {
    const { setPromptsPaused } = this.props;
    setPromptsPaused(true);
  }

  sendPageStatement() {
    const { screenReferrer } = this.props;
    const { clientShowing } = this.state;

    sendInteractionData({
      type: 'experienced',
      activity: {
        id: `${clientsPropsReferrer}/${clientShowing}`,
        type: 'assessment',
        title: I18n.t('xapi.clientproposals.proposalTitle', { client: clientShowing }),
        description: I18n.t('xapi.clientproposals.proposalDescription')
      },
      response: {
        timeAvailable: this.timeAvailable,
        timeResponse: new Date()
      },
      parent: clientsPropsReferrer,
      referrer: screenReferrer
    });
  }

  closeResourcePopup() {
    this.setState({
      isResourcePopupOpen: false,
      selectedResourceType: '',
      selectedResourceId: ''
    });
  }

  openResourcePopup(id, type) {
    this.setState({
      isResourcePopupOpen: true,
      selectedResourceType: type,
      selectedResourceId: id
    });
  }

  render() {
    const {
      clientData,
      displayReqFeedback,
      displaySoluFeedback,
      hideRequirementFeedback,
      hideSolutionFeedback,
      setClientStatus
    } = this.props;
    const {
      clientShowing,
      correctRequirements,
      correctSolutions,
      forceTooltipHide,
      isResourcePopupOpen,
      selectedResourceType,
      selectedResourceId,
    } = this.state;

    return (
      <div className="proposalPage">
        <div className="leftColumn">
          <div className="header">
            <Tooltip
              fieldName="generic.tooltips.proposals.back"
              forceHide={forceTooltipHide}
            >
              <span>
                <NavLink
                  to={`${clientsSelectorPath}`}
                  className="backBtn"
                  onClick={this.onGoBack}
                >
                  <span className="icon" />
                  <Translate className="text" value="clientprops.backBtn" />
                </NavLink>
              </span>
            </Tooltip>
            <ClientAvatar client={clientShowing} type="proposal" />
            <ProposalClientIcon client={clientShowing} />
          </div>
          <Requirements
            client={clientShowing}
            answeredCorrectly={correctRequirements}
            displayReqFeedback={displayReqFeedback}
            closeResourcePopup={this.closeResourcePopup}
          />
        </div>
        <div className="rightColumn">
          {correctRequirements ? (
            <>
              <SolutionFeedback
                clientData={clientData}
                closePopup={hideSolutionFeedback}
                onAnswerCorrectly={this.onCorrectSolutions}
                onModalExited={this.onSolutionExited}
                onModalOpen={this.onSolutionOpen}
                showPopup={displaySoluFeedback}
                setClientStatus={setClientStatus}
              />
              <SolutionsPanel
                answeredCorrectly={correctSolutions}
                clientData={clientData}
                displaySoluFeedback={displaySoluFeedback}
              />
            </>
          ) : (
            <>
              <RequirementFeedback
                clientData={clientData}
                onAnswerCorrectly={this.onCorrectRequirements}
                onLocked={this.onLockedRequirements}
                onLockClient={this.onLockClient}
                onRetry={hideRequirementFeedback}
                points={getClientDifficultyScore(clientShowing)}
                showFeedback={displayReqFeedback}
              />
              <ResourcesPanel
                client={clientShowing}
                isResourcePopupOpen={isResourcePopupOpen}
                selectedResourceType={selectedResourceType}
                selectedResourceId={selectedResourceId}
                onCloseResourcePopup={this.closeResourcePopup}
                onOpenResourcePopup={this.openResourcePopup}
              />
            </>
          )}
        </div>
      </div>
    );
  }
}

ProposalPage.defaultProps = {
  clientData: null
};

ProposalPage.propTypes = {
  clientData: PropTypes.object,
  clientShowing: PropTypes.string.isRequired,
  displayReqFeedback: PropTypes.bool.isRequired,
  displaySoluFeedback: PropTypes.bool.isRequired,
  displaySolutionFeedback: PropTypes.func.isRequired,
  hideSolutionFeedback: PropTypes.func.isRequired,
  hideRequirementFeedback: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  screenReferrer: PropTypes.string.isRequired,
  setClientShowing: PropTypes.func.isRequired,
  setClientStatus: PropTypes.func.isRequired,
  setCurrentHintGroup: PropTypes.func.isRequired,
  setPromptsPaused: PropTypes.func.isRequired
};

export const mapStateToProps = state => ({
  clientData: state.clientProposalData.clients.find(cl => (
    cl.id === state.clientProposalData.clientShowing
  )),
  clientShowing: state.clientProposalData.clientShowing,
  displayReqFeedback: state.clientProposalData.displayReqFeedback,
  displaySoluFeedback: state.clientProposalData.displaySoluFeedback,
  screenReferrer: state.genericData.screenReferrer
});

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProposalPage);
