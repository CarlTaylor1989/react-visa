import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import TutorialCarousel from './TutorialCarousel';
import TutorialTabs from './TutorialTabs';
import ActionCreators from '../../../actions/index';
import modalSettings from '../../../config/modalsettings';

import './TutorialPopup.scss';

export class TutorialPopup extends Component {
  constructor(props) {
    super(props);
    this.onPopupExit = this.onPopupExit.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { setHintsPaused, showPopup } = this.props;

    if (!prevProps.showPopup && showPopup) {
      setHintsPaused(true);
    }
  }

  onPopupExit() {
    const { setHintsPaused } = this.props;
    setHintsPaused(false);
  }

  render() {
    const {
      closePopup,
      setTutorialSlideIndex,
      showPopup,
      slideIndex
    } = this.props;

    return (
      <Modal
        open={showPopup}
        classNames={{
          modal: 'tutorialPopup',
          overlay: 'tutorialPopupOverlay'
        }}
        container={document.getElementById('app')}
        onClose={closePopup}
        onExited={this.onPopupExit}
        {...modalSettings}
      >
        <button
          type="button"
          className="exitPopup"
          onClick={closePopup}
        >
          <Translate value="generic.popupCloseBtn" />
        </button>
        <div className="popupWrapper">
          <div className="popupTitle">
            <Translate value="generic.tutorial.popupTitle" />
          </div>
          <div className="tabsCarouselContainer">
            <TutorialTabs
              setSlideIndex={setTutorialSlideIndex}
              slideIndex={slideIndex}
            />
            <TutorialCarousel
              setSlideIndex={setTutorialSlideIndex}
              slideIndex={slideIndex}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

TutorialPopup.propTypes = {
  closePopup: PropTypes.func.isRequired,
  setHintsPaused: PropTypes.func.isRequired,
  setTutorialSlideIndex: PropTypes.func.isRequired,
  showPopup: PropTypes.bool.isRequired,
  slideIndex: PropTypes.number.isRequired
};

export const mapStateToProps = state => ({
  slideIndex: state.tutorialData.slideIndex
});

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TutorialPopup);
