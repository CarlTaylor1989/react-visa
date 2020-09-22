import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import PerfectChallenges from './PerfectChallenges';
import IntroSequencePopup from '../../generic/introsequencepopup/IntroSequencePopup';
import Minimap from '../../generic/minimap/Minimap';
import ActionCreators from '../../../actions/index';
import FamilyContainer from './FamilyContainer';
import { sendInteractionData } from '../../../tracking/xapi/XApiAdapter';
import familyData from '../../../translations/en_us/network/maps/map1/families.json';
import challengeData from '../../../translations/en_us/network/maps/map1/challenges/index';
import { getUnloadEventName } from '../../../lib/app';
import * as helper from '../../../lib/map';
import { HINT_NETWORK } from '../../../config/hints';
import { mapReferrer } from '../../../config/referrers';

import './NetworkMap.scss';

export class NetworkMap extends Component {
  constructor(props) {
    super(props);
    this.timeAvailable = null;
    this.onClosePopup = this.onClosePopup.bind(this);
    this.sendPageStatement = this.sendPageStatement.bind(this);
  }

  componentDidMount() {
    const {
      checkStreakStatus,
      setCurrentHintGroup,
      setPopupReferrer
    } = this.props;

    this.timeAvailable = new Date();
    checkStreakStatus();
    setCurrentHintGroup(HINT_NETWORK);
    setPopupReferrer(mapReferrer);
    window.addEventListener(getUnloadEventName(), this.sendPageStatement);
  }

  componentDidUpdate(prevProps) {
    const {
      mapInitialised,
      initialiseMapState,
      setChallenges,
      setFamilies,
      suspendData
    } = this.props;

    // If map not initialised then set the redux state
    if (!prevProps.mapInitialised && !mapInitialised) {
      // Parse map suspend data
      const mapData = helper.getStoredMapData(suspendData);

      // Create challenges data
      const challenges = [];
      _.forIn(challengeData, (data, familyId) => {
        data.map(ch => challenges.push({
          id: ch.id,
          productId: ch.productId,
          familyId,
          isFinal: !ch.children.length,
          isFirst: ch.isFirst || false,
          status: helper.getStoredChallengeStatus(
            mapData.challenges,
            ch.id,
            familyId,
            ch.isFirst
          ),
          gomoId: ch.gomoId
        }));
      });

      setFamilies(mapData.families);
      setChallenges(challenges);
      initialiseMapState(true);
    }
  }

  componentWillUnmount() {
    const { commit, prepareSuspendData, setScreenReferrer } = this.props;

    this.sendPageStatement();
    setScreenReferrer(mapReferrer);

    prepareSuspendData();
    commit();

    window.removeEventListener(getUnloadEventName(), this.sendPageStatement);
  }

  onClosePopup() {
    const { setNetworkIntroSeen } = this.props;
    setNetworkIntroSeen();
  }

  sendPageStatement() {
    const { screenReferrer } = this.props;
    sendInteractionData({
      type: 'experienced',
      activity: {
        id: 'map',
        type: 'module',
        title: I18n.t('xapi.map.title'),
        description: I18n.t('xapi.map.description')
      },
      response: {
        timeAvailable: this.timeAvailable,
        timeResponse: new Date()
      },
      parent: '',
      referrer: screenReferrer
    });
  }

  displayPopup() {
    const {
      canDisplayIntroPopup,
      networkIntroSeen,
      networkIntroSeenSession
    } = this.props;
    if (!networkIntroSeenSession) {
      if (!networkIntroSeen) return true;
      return !canDisplayIntroPopup;
    }
    return false;
  }

  render() {
    const families = _.keys(familyData).map((familyId, index) => (
      <FamilyContainer
        key={`${familyId}${index.toString()}`}
        familyId={familyId}
        mapId={familyData[familyId].mapId}
      />
    ));

    const { challenges, perfect } = this.props;
    const open = this.displayPopup();

    return (
      <div className="networkMap">
        <IntroSequencePopup
          open={open}
          onClose={this.onClosePopup}
          translations="network"
        />
        <div className="contours" />

        <div className="mapContainer">
          {families}
          <span className="home" />
        </div>
        <PerfectChallenges
          current={perfect.length}
          total={challenges.length}
        />
        <Minimap />
      </div>
    );
  }
}

NetworkMap.propTypes = {
  canDisplayIntroPopup: PropTypes.bool.isRequired,
  challenges: PropTypes.array.isRequired,
  checkStreakStatus: PropTypes.func.isRequired,
  commit: PropTypes.func.isRequired,
  initialiseMapState: PropTypes.func.isRequired,
  mapInitialised: PropTypes.bool.isRequired,
  networkIntroSeen: PropTypes.bool.isRequired,
  networkIntroSeenSession: PropTypes.bool.isRequired,
  perfect: PropTypes.array.isRequired,
  prepareSuspendData: PropTypes.func.isRequired,
  screenReferrer: PropTypes.string.isRequired,
  setChallenges: PropTypes.func.isRequired,
  setFamilies: PropTypes.func.isRequired,
  setCurrentHintGroup: PropTypes.func.isRequired,
  setNetworkIntroSeen: PropTypes.func.isRequired,
  setScreenReferrer: PropTypes.func.isRequired,
  setPopupReferrer: PropTypes.func.isRequired,
  suspendData: PropTypes.object.isRequired
};

export const mapStateToProps = state => ({
  challenges: state.mapData.challenges,
  canDisplayIntroPopup: state.genericData.canDisplayIntroPopup,
  mapInitialised: state.mapData.initialised,
  networkIntroSeen: state.genericData.networkIntroSeen,
  networkIntroSeenSession: state.genericData.networkIntroSeenSession,
  perfect: state.mapData.perfect,
  screenReferrer: state.genericData.screenReferrer,
  suspendData: state.scormData.suspendData
});

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NetworkMap);
