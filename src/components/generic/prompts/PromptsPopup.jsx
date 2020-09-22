import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import AchievementPrompt from './AchievementPrompt';
import MultipleAchievementsPrompt from './MultipleAchievementsPrompt';
import RankPrompt from './RankPrompt';
import ProductPrompt from './ProductPrompt';
import BonusStreakPrompt from './BonusStreakPrompt';
import modalSettings from '../../../config/modalsettings';
import {
  ACHIEVEMENT_PROMPT,
  BONUS_STREAK_PROMPT,
  PRODUCT_PROMPT,
  RANK_PROMPT
} from '../../../config/constants';

import './PromptsPopup.scss';

class PromptsPopup extends Component {
  constructor(props) {
    super(props);
    this.closePopup = this.closePopup.bind(this);
  }

  closePopup() {
    const { closePopup } = this.props;
    closePopup();
  }

  render() {
    const {
      exitPopup,
      index,
      prompts,
      setPlayAudio,
      showPopup
    } = this.props;

    let current = prompts.length ? prompts[index] : null;
    let content = null;
    const achievementPrompts = prompts.filter(prompt => prompt.type === ACHIEVEMENT_PROMPT);

    if (
      achievementPrompts.length > 1
      && current.type === ACHIEVEMENT_PROMPT
    ) {
      current = prompts[achievementPrompts.length - 1];
      content = (
        <MultipleAchievementsPrompt
          prompts={achievementPrompts}
          setPlayAudio={setPlayAudio}
        />
      );
    } else if (current && current.type) {
      if (current.type === ACHIEVEMENT_PROMPT) {
        content = (
          <AchievementPrompt
            achievementId={current.id}
            setPlayAudio={setPlayAudio}
          />
        );
      } else if (current.type === RANK_PROMPT) {
        content = (
          <RankPrompt rankId={current.id} setPlayAudio={setPlayAudio} />
        );
      } else if (current.type === PRODUCT_PROMPT) {
        content = (
          <ProductPrompt
            productId={current.id}
            familyId={current.family}
            mapId={current.map}
            setPlayAudio={setPlayAudio}
          />
        );
      } else if (current.type === BONUS_STREAK_PROMPT) {
        content = <BonusStreakPrompt setPlayAudio={setPlayAudio} />;
      }
    }

    return (
      <Modal
        open={showPopup}
        classNames={{
          modal: 'promptsPopup',
          overlay: 'promptsPopupOverlay'
        }}
        container={document.getElementById('app')}
        onClose={this.closePopup}
        onExited={exitPopup}
        {...modalSettings}
      >
        <div className="popupWrapper">
          {content}
          <button
            type="button"
            className="okBtn"
            onClick={this.closePopup}
          >
            <Translate value="generic.prompts.okBtn" />
          </button>
        </div>
      </Modal>
    );
  }
}

PromptsPopup.propTypes = {
  closePopup: PropTypes.func.isRequired,
  exitPopup: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  prompts: PropTypes.array.isRequired,
  setPlayAudio: PropTypes.func.isRequired,
  showPopup: PropTypes.bool.isRequired
};

export default PromptsPopup;
