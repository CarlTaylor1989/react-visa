import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { I18n, Translate } from 'react-redux-i18n';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import InlineSVG from 'svg-inline-react';
import _ from 'lodash';
import Minimap from '../../../generic/minimap/Minimap';
import MapText from '../MapText';
import ProductIcon from '../ProductIcon';
import ChallengeIconContent from './ChallengeIconContent';
import IframeChallengesPopup from '../../../generic/iframepopup/IframeChallengesPopup';
import IframeLearningPopup from '../../../generic/iframepopup/IframeLearningPopup';
import Tooltip from '../../../generic/tooltip/Tooltip';
import ActionCreators from '../../../../actions/index';
import { networkMapPath } from '../../../../config/navigation';
import { productReferrer } from '../../../../config/referrers';
import { HINT_PRODUCT, HINT_TIME } from '../../../../config/hints';
import { getUnloadEventName } from '../../../../lib/app';
import { sendInteractionData } from '../../../../tracking/xapi/XApiAdapter';
import familyData from '../../../../translations/en_us/network/maps/map1/families.json';
import products from '../../../../translations/en_us/network/maps/map1/products/index';
import challengeData from '../../../../translations/en_us/network/maps/map1/challenges/index';
import {
  CHALLENGE_PERFECT_STATUS,
  CHALLENGE_COMPLETION_STATUS
} from '../../../../config/constants';

import './ProductPage.scss';

export const setChallengeIframeRef = (element) => {
  if (element) {
    window.game.iframeChallengePopup = element;
  }
};

export class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animateChallenges: [],
      completedChallenges: [],
      displayChalengesPopup: false,
      displayLearningPopup: false,
      forceTooltipHide: false,
      pendingChallenges: []
    };

    this.inactivityTime = null;
    this.activityMonitor = null;
    this.timeAvailable = null;
    this.productName = '';

    this.onGoBack = this.onGoBack.bind(this);
    this.onOpenLearningPopup = this.onOpenLearningPopup.bind(this);
    this.onExitLearningPopup = this.onExitLearningPopup.bind(this);

    this.onOpenChallengesPopup = this.onOpenChallengesPopup.bind(this);
    this.onCloseChallengesPopup = this.onCloseChallengesPopup.bind(this);

    this.onModalExited = this.onModalExited.bind(this);
    this.onChallengeModalExited = this.onChallengeModalExited.bind(this);
    this.onModalOpen = this.onModalOpen.bind(this);

    this.sendPageStatement = this.sendPageStatement.bind(this);
    this.checkInactivity = this.checkInactivity.bind(this);
  }

  componentDidMount() {
    const {
      checkStreakStatus,
      currentFamily,
      currentProduct,
      setCurrentHintGroup,
      setPopupReferrer
    } = this.props;

    this.timeAvailable = new Date();

    checkStreakStatus();
    setCurrentHintGroup(HINT_PRODUCT);
    setPopupReferrer(productReferrer + currentFamily + currentProduct);
    window.addEventListener(getUnloadEventName(), this.sendPageStatement);
    this.setProductPageViewed();
    this.startActivityMonitor();
    const completed = this.getCompletedChallenges();
    this.setState({
      completedChallenges: completed
    });
  }

  componentDidUpdate(prevProps) {
    const { promptsShown } = this.props;
    const { pendingChallenges } = this.state;
    if (pendingChallenges.length && prevProps.promptsShown && !promptsShown) {
      this.setAnimateChallenges();
    }
  }

  componentWillUnmount() {
    const {
      commit,
      currentFamily,
      currentProduct,
      prepareSuspendData,
      setProductPageInactive,
      setScreenReferrer
    } = this.props;
    const fullProductId = currentFamily + currentProduct;

    this.sendPageStatement();
    setScreenReferrer(productReferrer + fullProductId);
    setProductPageInactive(true);
    this.stopActivityMonitor();

    prepareSuspendData();
    commit();

    window.removeEventListener(getUnloadEventName(), this.sendPageStatement);
  }

  onGoBack() {
    this.setState({
      forceTooltipHide: true
    });
  }

  onOpenLearningPopup() {
    this.setState({ displayLearningPopup: true });
    this.stopActivityMonitor();
  }

  onExitLearningPopup() {
    this.setState({ displayLearningPopup: false });
    this.startActivityMonitor();
  }

  onOpenChallengesPopup() {
    this.setState({ displayChalengesPopup: true });
    this.stopActivityMonitor();
  }

  onCloseChallengesPopup() {
    this.setState({ displayChalengesPopup: false });
    this.startActivityMonitor();
  }

  onModalOpen() {
    const { setHintsPaused, setPromptsPaused } = this.props;

    setHintsPaused(true);
    setPromptsPaused(true);

    this.mergeCompleteAnimatedChallenges();
  }

  onChallengeModalExited() {
    const { completedChallenges } = this.state;
    this.onModalExited();
    const completed = this.getCompletedChallenges();
    const animate = _.reject(completed, val => completedChallenges.includes(val));
    this.setState({
      pendingChallenges: animate
    });
  }

  onModalExited() {
    const { setHintsPaused, setPromptsPaused } = this.props;
    setHintsPaused(false);
    setPromptsPaused(false);
  }

  setAnimateChallenges() {
    const { pendingChallenges } = this.state;
    this.setState({
      animateChallenges: pendingChallenges,
      pendingChallenges: []
    });
  }

  setProductPageViewed() {
    const {
      productPageViewed,
      setProductPageViewedSession
    } = this.props;
    if (!productPageViewed) {
      setProductPageViewedSession();
    }
  }

  getCompletedChallenges() {
    const { challenges, currentFamily } = this.props;

    const completedChallenges = challenges.filter(ch => ch.familyId === currentFamily
      && (ch.status === CHALLENGE_COMPLETION_STATUS || ch.status === CHALLENGE_PERFECT_STATUS));
    return completedChallenges.map(ch => ch.id);
  }

  mergeCompleteAnimatedChallenges() {
    const { animateChallenges, completedChallenges } = this.state;
    if (animateChallenges.length) {
      this.setState({
        animateChallenges: [],
        completedChallenges: [
          ...completedChallenges,
          ...animateChallenges
        ]
      });
    }
  }

  sendPageStatement() {
    const {
      currentFamily,
      currentProduct,
      screenReferrer
    } = this.props;
    const fullProductId = currentFamily + currentProduct;
    sendInteractionData({
      type: 'experienced',
      activity: {
        id: `product/${fullProductId}`,
        type: 'module',
        title: this.productName,
        description: I18n.t('xapi.products.description', { name: this.productName })
      },
      response: {
        timeAvailable: this.timeAvailable,
        timeResponse: new Date()
      },
      parent: 'map',
      referrer: screenReferrer
    });
  }

  startActivityMonitor() {
    const { productPageInactive } = this.props;
    if (!productPageInactive) {
      this.inactivityTime = new Date();
      this.activityMonitor = setInterval(this.checkInactivity, 2000);
    }
  }

  stopActivityMonitor() {
    clearInterval(this.activityMonitor);
    this.activityMonitor = null;
    this.inactivityTime = null;
  }

  checkInactivity() {
    const { setProductPageInactive } = this.props;
    const difference = new Date() - this.inactivityTime; // in msec

    if (difference >= HINT_TIME) {
      this.stopActivityMonitor();
      setProductPageInactive(true);
    }
  }

  render() {
    const {
      currentMap,
      currentFamily,
      currentProduct,
      popupReferrer
    } = this.props;

    const family = familyData[currentFamily];
    const fullProductId = currentFamily + currentProduct;
    const type = I18n.t(`network.productpages.${fullProductId}.type`);
    const productData = products[currentFamily].find(prod => prod.id === currentProduct);
    const nameCoord = {
      ...productData.large.nameCoord,
      name: productData.nameCoord.name
    };
    const productChallenges = challengeData[currentFamily].filter(ch => (
      ch.productId === currentProduct
    ));
    const challengeIcons = productChallenges.map(data => (
      <ChallengeIconContent
        key={`${currentFamily}${data.id}`}
        challengeId={data.id}
        coordinates={data.productCoordinates}
        familyId={currentFamily}
        type={data.productType}
      />
    ));

    this.productName = nameCoord.name;

    const {
      animateChallenges,
      completedChallenges,
      displayChalengesPopup,
      displayLearningPopup,
      forceTooltipHide
    } = this.state;

    const completed = `${completedChallenges.join(' ')} ${animateChallenges.join(' ')}`;

    const svg = require(`../../../../resources/${currentMap}/${currentFamily}/${fullProductId}.svg`); // eslint-disable-line
    return (
      <div className={`productPage ${type} ${fullProductId}`}>
        <div className="header">
          <Tooltip fieldName="generic.tooltips.product.back" forceHide={forceTooltipHide}>
            <span>
              <NavLink
                to={`${networkMapPath}`}
                className="backBtn"
                onClick={this.onGoBack}
              >
                <span className="icon" />
                <Translate className="text" value="network.productpages.generic.backBtn" />
              </NavLink>
            </span>
          </Tooltip>
          <span
            dangerouslySetInnerHTML={{ __html: family.nameCoord.name }} // eslint-disable-line react/no-danger
            className={`familyName ${family.type}`}
          />
        </div>
        <div className="content">
          <Translate
            className="pageTitle"
            value={`network.productpages.${fullProductId}.title`}
          />
          <Translate
            className="bodyText"
            dangerousHTML
            value={`network.productpages.${fullProductId}.bodyText`}
          />
        </div>
        <div className="buttonArea">
          <Tooltip fieldName="generic.tooltips.product.learning">
            <button
              type="button"
              className="openLearningBtn"
              onClick={this.onOpenLearningPopup}
            >
              <span className="icon" />
              <Translate className="text" value="network.productpages.generic.openLearningBtn" />
            </button>
          </Tooltip>
          <Translate className="orText" value="network.productpages.generic.or" />
          <Tooltip fieldName="generic.tooltips.product.challenges">
            <button
              type="button"
              className="openChallengesBtn"
              onClick={this.onOpenChallengesPopup}
            >
              <span className="icon" />
              <Translate className="text" value="network.productpages.generic.openChallengesBtn" />
            </button>
          </Tooltip>
        </div>
        <div className={`productContainer ${fullProductId} ${completed}`}>
          <InlineSVG className="productSvg" src={svg} />
          <ProductIcon
            type="large"
            coordinates={productData.large.coordinates}
            productId={currentProduct}
            familyId={currentFamily}
            status={0}
            mapId={currentMap}
            priorityPosition="top"
            useButton={false}
          />
          <MapText
            nameCoord={nameCoord}
            type={`productName large ${nameCoord.classes ? nameCoord.classes.join(' ') : ''}`}
          />
          {challengeIcons}
        </div>
        <Minimap />
        <IframeChallengesPopup
          closePopup={this.onCloseChallengesPopup}
          onExited={this.onChallengeModalExited}
          onModalOpen={this.onModalOpen}
          ref={setChallengeIframeRef}
          showPopup={displayChalengesPopup}
          popupReferrer={popupReferrer}
        />
        <IframeLearningPopup
          closePopup={this.onExitLearningPopup}
          iframeSrc={productData.link}
          onExited={this.onModalExited}
          onModalOpen={this.onModalOpen}
          showPopup={displayLearningPopup}
          gomoId={productData.gomoId}
          popupReferrer={popupReferrer}
        />
      </div>
    );
  }
}

ProductPage.propTypes = {
  challenges: PropTypes.array.isRequired,
  checkStreakStatus: PropTypes.func.isRequired,
  commit: PropTypes.func.isRequired,
  currentMap: PropTypes.string.isRequired,
  currentFamily: PropTypes.string.isRequired,
  currentProduct: PropTypes.string.isRequired,
  popupReferrer: PropTypes.string.isRequired,
  prepareSuspendData: PropTypes.func.isRequired,
  productPageInactive: PropTypes.bool.isRequired,
  productPageViewed: PropTypes.bool.isRequired,
  screenReferrer: PropTypes.string.isRequired,
  setCurrentHintGroup: PropTypes.func.isRequired,
  setProductPageViewedSession: PropTypes.func.isRequired,
  setHintsPaused: PropTypes.func.isRequired,
  setPopupReferrer: PropTypes.func.isRequired,
  setProductPageInactive: PropTypes.func.isRequired,
  setPromptsPaused: PropTypes.func.isRequired,
  setScreenReferrer: PropTypes.func.isRequired,
  promptsShown: PropTypes.bool.isRequired
};

export const mapStateToProps = state => ({
  challenges: state.mapData.challenges,
  challengesCompleted: state.mapData.completedChallengesSession,
  currentMap: state.mapData.currentMap,
  currentFamily: state.mapData.currentFamily,
  currentProduct: state.mapData.currentProduct,
  location: state.router.location.pathname,
  popupReferrer: state.genericData.popupReferrer,
  productPageInactive: state.genericData.productPageInactive,
  productPageViewed: state.mapData.productPageViewedSession,
  screenReferrer: state.genericData.screenReferrer,
  promptsShown: state.promptsData.show
});

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductPage);
