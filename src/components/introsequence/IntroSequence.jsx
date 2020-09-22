import React from 'react';
import { I18n, Translate } from 'react-redux-i18n';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { GoToScreen, newScreenConnect } from '../generic/GoToScreen';
import IntroSlide from './IntroSlide';
import { clientsPropsPath, networkPath } from '../../config/navigation';
import { introSequenceReferrer } from '../../config/referrers';
import defaultSliderSettings from '../../config/slider';
import { getUnloadEventName } from '../../lib/app';
import { sendInteractionData } from '../../tracking/xapi/XApiAdapter';

import './IntroSequence.scss';

export class IntroSequence extends GoToScreen {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0,
      noOfSlides: 0
    };
    this.timeAvailable = null;
    this.slideAvailable = null;

    this.setSliderReference = this.setSliderReference.bind(this);
    this.onBeforeChange = this.onBeforeChange.bind(this);
    this.onAfterChange = this.onAfterChange.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onIntroComplete = this.onIntroComplete.bind(this);
    this.sendSlideTrackingData = this.sendSlideTrackingData.bind(this);
    this.getContentGraphicClassname = this.getContentGraphicClassname.bind(this);
  }

  componentDidMount() {
    const { setPopupReferrer } = this.props;
    setPopupReferrer(introSequenceReferrer);
    this.timeAvailable = new Date();
    this.slideAvailable = new Date();

    this.setState({
      noOfSlides: this.slider ? this.slider.props.children.length : 0
    });

    window.addEventListener(getUnloadEventName(), this.sendSlideTrackingData);
  }

  componentWillUnmount() {
    this.sendSlideTrackingData();
    this.sendCompletionTrackingData();
    window.removeEventListener(getUnloadEventName(), this.sendSlideTrackingData);
  }

  setSliderReference(slider) {
    this.slider = slider;
  }

  onBeforeChange(current, next) {
    this.sendSlideTrackingData();
    this.setState({ currentIndex: next });
  }

  onAfterChange() {
    this.slideAvailable = new Date();
  }

  onBack() {
    this.slider.slickPrev();
  }

  onNext() {
    this.slider.slickNext();
  }

  onIntroComplete(screenId) {
    const { setIntroSeqCompleted, setScreenReferrer } = this.props;
    setIntroSeqCompleted();
    setScreenReferrer(introSequenceReferrer);
    this.onGoToScreen(screenId);
  }

  sendSlideTrackingData() {
    const { screenReferrer } = this.props;
    const { currentIndex } = this.state;
    const index = currentIndex + 1;
    sendInteractionData({
      type: 'experienced',
      activity: {
        id: `introsequence/slide${index}`,
        type: 'slide',
        title: I18n.t('xapi.introseq.title', { value: index }),
        description: I18n.t(`introseq.slides.${currentIndex}.text`)
      },
      response: {
        timeAvailable: this.slideAvailable,
        timeResponse: new Date()
      },
      parent: 'introsequence',
      referrer: screenReferrer
    });
  }

  sendCompletionTrackingData() {
    sendInteractionData({
      type: 'completed',
      activity: {
        id: 'introsequence',
        type: 'slide-deck',
        title: I18n.t('xapi.introseq.pageTitle'),
        description: I18n.t('xapi.introseq.description')
      },
      response: {
        timeAvailable: this.timeAvailable,
        timeResponse: new Date()
      },
      parent: ''
    });
  }

  getContentGraphicClassname() {
    const { currentIndex } = this.state;
    let name = '';

    if (currentIndex === 1) {
      name = 'client';
    } else if (currentIndex === 2) {
      name = 'map';
    } else {
      name = 'woman';
    }

    return name;
  }

  render() {
    const { noOfSlides, currentIndex } = this.state;
    const sliderSettings = {
      ...defaultSliderSettings,
      initialSlide: 0,
      beforeChange: this.onBeforeChange,
      afterChange: this.onAfterChange
    };
    const routesDisabled = currentIndex < noOfSlides - 1;

    const carouseItems = Object.keys(I18n.t('introseq.slides')).map((value, index) => (
      <IntroSlide
        key={`ci${index.toString()}`}
        title={I18n.t(`introseq.slides.${value}.title`)}
        text={I18n.t(`introseq.slides.${value}.text`)}
      />
    ));

    return (
      <div className="introSequence">
        <div className="routeButtons">
          <button
            type="button"
            className={`clientPropsBtn${routesDisabled ? ' disabled' : ''}`}
            disabled={routesDisabled}
            onClick={() => this.onIntroComplete(clientsPropsPath)}
          >
            <span className="icon" />
            <Translate value="clientprops.clientPropsBtn" />
          </button>
          <button
            type="button"
            className={`productNetworkBtn${routesDisabled ? ' disabled' : ''}`}
            disabled={routesDisabled}
            onClick={() => this.onIntroComplete(networkPath)}
          >
            <span className="icon" />
            <Translate value="network.productNetworkBtn" />
          </button>
        </div>
        <span className={`contentGraphic ${this.getContentGraphicClassname()}`} />
        <div className="carouselContainer">
          <Slider
            className="introCarousel"
            ref={this.setSliderReference}
            {...sliderSettings}
          >
            {carouseItems}
          </Slider>
          <div className="navButtons">
            <button
              type="button"
              className="backBtn"
              disabled={currentIndex === 0}
              onClick={this.onBack}
            >
              <span className="icon" />
              <Translate value="introseq.backBtn" />
            </button>
            <button
              type="button"
              className="nextBtn"
              disabled={currentIndex === noOfSlides - 1}
              onClick={this.onNext}
            >
              <Translate value="introseq.nextBtn" />
              <span className="icon" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

IntroSequence.propTypes = {
  screenReferrer: PropTypes.string.isRequired,
  setIntroSeqCompleted: PropTypes.func.isRequired,
  setPopupReferrer: PropTypes.func.isRequired,
  setScreenReferrer: PropTypes.func.isRequired
};

export const mapStateToProps = state => ({
  screenReferrer: state.genericData.screenReferrer
});

export default newScreenConnect(IntroSequence, mapStateToProps);
