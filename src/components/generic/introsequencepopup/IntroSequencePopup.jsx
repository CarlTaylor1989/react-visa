import React, {
  Component,
  createRef
} from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';
import { I18n, Translate } from 'react-redux-i18n';
import Slider from 'react-slick';
import IntroSlidePopup from './IntroSlidePopup';
import modalSettings from '../../../config/modalsettings';
import defaultSliderSettings from '../../../config/slider';

import './IntroSequencePopup.scss';

class IntroSequencePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      noOfSlides: 0
    };
    this.sliderRef = createRef();
    this.onBack = this.onBack.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  componentDidMount() {
    const { current } = this.sliderRef;
    this.setState({ noOfSlides: (current && current.props) ? current.props.children.length : 0 });
  }

  onBeforeChange = (current, next) => {
    this.setState({ currentIndex: next });
  }

  onBack() {
    const { current } = this.sliderRef;
    current.slickPrev();
  }

  onNext() {
    const { current } = this.sliderRef;
    current.slickNext();
  }

  render() {
    const {
      currentIndex,
      noOfSlides
    } = this.state;
    const {
      onClose,
      open,
      translations
    } = this.props;

    const sliderSettings = {
      ...defaultSliderSettings,
      beforeChange: this.onBeforeChange
    };

    const slides = Object.keys(I18n.t(`${translations}.introsequence`)).map((value, index) => (
      <IntroSlidePopup
        key={`is${index.toString()}`}
        text={I18n.t(`${translations}.introsequence.${value}.text`)}
      />
    ));

    return (
      <Modal
        {...modalSettings}
        center={false}
        classNames={{
          modal: 'introSequenceModal',
          overlay: 'introSequenceOverlay'
        }}
        container={document.getElementById('app')}
        onClose={onClose}
        open={open}
      >
        <div className="introSequenceContents">
          <div className="title">
            <Translate value={`${translations}.introSequenceTitle`} />
          </div>
          <Slider
            {...sliderSettings}
            className="introSequenceCarousel"
            ref={this.sliderRef}
          >
            {slides}
          </Slider>
          <div className="navButtons">
            <button
              className="backBtn"
              disabled={currentIndex === 0}
              onClick={this.onBack}
              type="button"
            >
              <span className="icon" />
              <Translate value={`${translations}.backBtn`} />
            </button>
            <button
              className="nextBtn"
              disabled={currentIndex === noOfSlides - 1}
              onClick={this.onNext}
              type="button"
            >
              <Translate value={`${translations}.nextBtn`} />
              <span className="icon" />
            </button>
          </div>
          <div className={`continueBtn ${currentIndex === noOfSlides - 1 ? '' : 'hidden'}`}>
            <button onClick={onClose} type="button">
              <Translate value={`${translations}.start`} />
            </button>
          </div>
          <div className={`skipBtn ${currentIndex === noOfSlides - 1 ? 'hidden' : ''}`}>
            <button onClick={onClose} type="button">
              <Translate value={`${translations}.skipBtn`} />
              <span className="icon" />
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

IntroSequencePopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  translations: PropTypes.string.isRequired
};

export default IntroSequencePopup;
