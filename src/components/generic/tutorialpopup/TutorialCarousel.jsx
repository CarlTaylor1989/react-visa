import React, { Component } from 'react';
import Slider from 'react-slick';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { I18n, Translate } from 'react-redux-i18n';
import TutorialSlide from './TutorialSlide';
import defaultSliderSettings from '../../../config/slider';
import { sendInteractionData } from '../../../tracking/xapi/XApiAdapter';

import './TutorialCarousel.scss';

export class TutorialCarousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: props.slideIndex,
      noOfSlides: 0,
      sectionsViewed: []
    };
    this.slideAvailable = null;
    this.tutorialSlides = Object.values(I18n.t('generic.tutorial.slides'));

    this.setSliderReference = this.setSliderReference.bind(this);
    this.onBeforeChange = this.onBeforeChange.bind(this);
    this.onAfterChange = this.onAfterChange.bind(this);
    this.onCarouselInit = this.onCarouselInit.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onSlideViewed = this.onSlideViewed.bind(this);
  }

  componentDidMount() {
    this.setState({
      noOfSlides: this.slider ? this.slider.props.children.length : 0
    });
  }

  componentDidUpdate(prevProps) {
    const { slideIndex } = this.props;
    if (prevProps.slideIndex !== slideIndex) {
      this.slider.slickGoTo(slideIndex, true);
    }
  }

  componentWillUnmount() {
    this.sendSlideTrackingData();
    this.onSlideViewed();
  }

  onCarouselInit() {
    this.slideAvailable = new Date();
    this.onSlideViewed();
  }

  onBeforeChange(current, next) {
    const { setSlideIndex } = this.props;
    setSlideIndex(next);
    this.sendSlideTrackingData();
    this.onSlideViewed();
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

  onSlideViewed() {
    const { currentIndex } = this.state;
    this.tutorialSlides[currentIndex].viewed = true;

    const filteredSection = this.tutorialSlides.filter(
      slide => slide.section === this.tutorialSlides[currentIndex].section
    );

    if (filteredSection.every(slide => slide.viewed)) {
      this.onSectionComplete(this.tutorialSlides[currentIndex].section);
    }
  }

  onSectionComplete(section) {
    const { sectionsViewed } = this.state;

    if (!sectionsViewed.includes(section)) {
      this.setState({
        sectionsViewed: [
          ...sectionsViewed,
          section
        ]
      });
      this.sendSectionCompletedTrackingData(section);
    }
  }

  setSliderReference(slider) {
    this.slider = slider;
  }

  sendSectionCompletedTrackingData() {
    const { currentIndex } = this.state;
    const currentSection = this.tutorialSlides[currentIndex].section;
    const currentTab = _.filter(I18n.t('generic.tutorial.tabs'),
      tab => tab.section === currentSection);

    sendInteractionData({
      type: 'completed',
      activity: {
        id: `tutorial_${currentSection}`,
        type: 'slide-deck',
        title: I18n.t('xapi.tutorials.sectionTitle', {
          id: currentSection
        }),
        description: I18n.t('xapi.tutorials.description', {
          title: currentTab[0].label
        })
      },
      parent: ''
    });
  }

  sendSlideTrackingData() {
    const { currentIndex } = this.state;
    const slideData = I18n.t(`generic.tutorial.slides.${currentIndex}`);
    sendInteractionData({
      type: 'experienced',
      activity: {
        id: `tutorial_${slideData.section}/slide${currentIndex + 1}`,
        type: 'slide',
        title: I18n.t('xapi.tutorials.slideTitle', {
          id: slideData.section,
          index: currentIndex + 1
        }),
        description: slideData.text
      },
      response: {
        timeAvailable: this.slideAvailable,
        timeResponse: new Date()
      },
      parent: `tutorial_${slideData.section}`
    });
  }

  render() {
    const { slideIndex } = this.props;
    const { noOfSlides, currentIndex } = this.state;

    const sliderSettings = {
      ...defaultSliderSettings,
      initialSlide: slideIndex,
      beforeChange: this.onBeforeChange,
      afterChange: this.onAfterChange,
      onInit: this.onCarouselInit
    };

    const carouseItems = _.keys(I18n.t('generic.tutorial.slides')).map((value, index) => (
      <TutorialSlide
        key={`ts${index.toString()}`}
        title=""
        imageSrc={I18n.t(`generic.tutorial.slides.${value}.imageSrc`)}
        text={I18n.t(`generic.tutorial.slides.${value}.text`)}
      />
    ));

    return (
      <div className="tutorialCarousel">
        <Slider
          className="carouselContainer"
          ref={this.setSliderReference}
          onInit={this.onSlideViewed}
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
            <Translate value="generic.tutorial.backBtn" />
          </button>
          <span className="progress">
            {currentIndex + 1}
            <Translate value="generic.tutorial.progressSeparator" />
            {noOfSlides}
          </span>
          <button
            type="button"
            className="nextBtn"
            disabled={currentIndex === noOfSlides - 1}
            onClick={this.onNext}
          >
            <Translate value="generic.tutorial.nextBtn" />
            <span className="icon" />
          </button>
        </div>
      </div>
    );
  }
}

TutorialCarousel.propTypes = {
  slideIndex: PropTypes.number.isRequired,
  setSlideIndex: PropTypes.func.isRequired
};

export default TutorialCarousel;
