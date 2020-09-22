import React, { Component } from 'react';
import _ from 'lodash';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import ScrollBar from 'react-scrollbars-custom';
import { bindActionCreators } from 'redux';
import ClientIconButton from './ClientIconButton';
import ClientInfo from './ClientInfo';
import IntroSequencePopup from '../../generic/introsequencepopup/IntroSequencePopup';
import ActionCreators from '../../../actions/index';
import { sendInteractionData } from '../../../tracking/xapi/XApiAdapter';
import clientData from '../../../config/clients';
import clientTranslationData from '../../../translations/en_us/clientproposals/clients';
import { getUnloadEventName } from '../../../lib/app';
import { HINT_CLIENT_SELECTION } from '../../../config/hints';
import scrollBarSettings from '../../../config/scrollBar';
import { clientsPropsReferrer } from '../../../config/referrers';
import { CLIENT_NOT_STARTED, CLIENT_COMPLETED } from '../../../config/constants';

import './ProposalsSelector.scss';
import GetStarted from './GetStarted';

export class ProposalsSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayPanel: false,
      selectedClient: props.clientShowing
    };

    this.onClientSelected = this.onClientSelected.bind(this);
    this.sendStatements = this.sendStatements.bind(this);
    this.onClosePopup = this.onClosePopup.bind(this);
    this.timeAvailable = null;
    this.levelAvailable = null;
  }

  componentDidMount() {
    const {
      checkStreakStatus,
      setCurrentHintGroup
    } = this.props;
    checkStreakStatus();
    setCurrentHintGroup(HINT_CLIENT_SELECTION);

    this.parseClientData();

    this.timeAvailable = new Date();
    this.levelAvailable = new Date();
    window.addEventListener(getUnloadEventName(), this.sendStatements);
  }

  componentDidUpdate(prevProps) {
    const { clientShowing } = this.props;
    if (prevProps.clientShowing && !clientShowing) {
      this.clearSelectedClient();
    }
  }

  componentWillUnmount() {
    const {
      commit,
      prepareSuspendData,
      setScreenReferrer
    } = this.props;

    this.sendStatements();
    setScreenReferrer(clientsPropsReferrer);
    prepareSuspendData();
    commit();

    window.removeEventListener(getUnloadEventName(), this.sendStatements);
  }

  onClientSelected(clientId) {
    const { selectedClient } = this.state;
    this.setState({
      selectedClient: selectedClient === clientId ? '' : clientId
    });
  }

  onClosePopup() {
    const { setClientIntroSeen } = this.props;
    setClientIntroSeen();
  }

  getClientStatus() {
    const { selectedClient } = this.state;
    const { clients } = this.props;
    const found = clients.find(client => client.id === selectedClient);
    return found ? found.status : CLIENT_NOT_STARTED;
  }

  clearSelectedClient() {
    this.setState({
      selectedClient: ''
    });
  }

  displayPopup() {
    const {
      canDisplayIntroPopup,
      clientIntroSeen,
      clientIntroSeenSession
    } = this.props;
    if (!clientIntroSeenSession) {
      if (!clientIntroSeen) return true;
      return !canDisplayIntroPopup;
    }
    return false;
  }

  parseClientData() {
    const { clients, setAllClients } = this.props;
    const clientsToAdd = [];

    if (!clients.length) {
      _.forOwn(clientData, (value, clientId) => {
        clientsToAdd.push(clientId);
      });
      setAllClients(clientsToAdd);
    }
  }

  sendStatements() {
    this.sendPageStatement();
  }

  sendPageStatement() {
    const { screenReferrer } = this.props;
    sendInteractionData({
      type: 'experienced',
      activity: {
        id: 'client-proposals',
        type: 'module',
        title: I18n.t('xapi.clientproposals.title'),
        description: I18n.t('xapi.clientproposals.description')
      },
      response: {
        timeAvailable: this.timeAvailable,
        timeResponse: new Date()
      },
      parent: '',
      referrer: screenReferrer
    });
  }

  render() {
    const { clients, locked } = this.props;
    const { displayPanel, selectedClient: selectedClientId } = this.state;
    const [selectedClient] = clients.filter(c => c.id === selectedClientId);
    const open = this.displayPopup();

    const clientDataArray = Object.keys(clientData).map(clientId => ({
      ...clientData[clientId],
      id: clientId,
      name: clientTranslationData[clientId].name,
      problemType: clientTranslationData[clientId].problemType
    }));

    const sortedClientIds = clientDataArray
      .sort(
        (a, b) => a.problemType.localeCompare(b.problemType)
        || a.name.localeCompare(b.name)
      )
      .map(client => client.id);

    const clientIcons = sortedClientIds.map(
      (clientId) => {
        const [client] = clients.filter(c => c.id === clientId);

        return (
          <ClientIconButton
            key={clientId}
            client={clientId}
            disabled={displayPanel}
            locked={locked.find(val => val.id === clientId)}
            onClientSelected={this.onClientSelected}
            selected={selectedClientId === clientId}
            completed={!!(client && client.status === CLIENT_COMPLETED)}
          />
        );
      }
    );

    return (
      <div className="proposalsSelector">
        <IntroSequencePopup
          open={open}
          onClose={this.onClosePopup}
          translations="clientprops"
        />
        {selectedClientId ? (
          <ClientInfo
            client={selectedClientId}
            status={this.getClientStatus()}
            attempts={selectedClient && selectedClient.reqAttempts ? selectedClient.reqAttempts : 0}
          />
        ) : (
          <GetStarted />
        )}
        <span className="divider" />
        <div className="scrollingArea">
          <ScrollBar {...scrollBarSettings}>
            <div className="clientIconWrapper">{clientIcons}</div>
          </ScrollBar>
        </div>
      </div>
    );
  }
}

ProposalsSelector.propTypes = {
  canDisplayIntroPopup: PropTypes.bool.isRequired,
  clients: PropTypes.array.isRequired,
  clientShowing: PropTypes.string.isRequired,
  checkStreakStatus: PropTypes.func.isRequired,
  commit: PropTypes.func.isRequired,
  clientIntroSeen: PropTypes.bool.isRequired,
  clientIntroSeenSession: PropTypes.bool.isRequired,
  locked: PropTypes.array.isRequired,
  prepareSuspendData: PropTypes.func.isRequired,
  screenReferrer: PropTypes.string.isRequired,
  setAllClients: PropTypes.func.isRequired,
  setClientShowing: PropTypes.func.isRequired,
  setCurrentHintGroup: PropTypes.func.isRequired,
  setClientIntroSeen: PropTypes.func.isRequired,
  setPromptsPaused: PropTypes.func.isRequired,
  setScreenReferrer: PropTypes.func.isRequired,
  toggleSettingsBtnState: PropTypes.func.isRequired
};

export const mapStateToProps = state => ({
  canDisplayIntroPopup: state.genericData.canDisplayIntroPopup,
  clients: state.clientProposalData.clients,
  clientShowing: state.clientProposalData.clientShowing,
  clientIntroSeen: state.genericData.clientIntroSeen,
  clientIntroSeenSession: state.genericData.clientIntroSeenSession,
  locked: state.clientProposalData.locked,
  screenReferrer: state.genericData.screenReferrer
});

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProposalsSelector);
