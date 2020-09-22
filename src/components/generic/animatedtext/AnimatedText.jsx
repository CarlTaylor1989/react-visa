import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';

import './AnimatedText.scss';

const AnimatedText = ({ texts, playAnimation, handleAnimationEnded }) => (
  <div className={`animatedText${playAnimation ? ' play' : ''}`}>
    {
      Object.keys(texts).map((text, i) => (
        <div key={texts[text].id} className="text-container">
          <div
            className="text"
            onAnimationEnd={i === Object.keys(texts).length - 1 ? handleAnimationEnded : null}
          >
            <Translate dangerousHTML value={texts[text].text} />
          </div>
        </div>
      ))
    }
  </div>
);

AnimatedText.propTypes = {
  texts: PropTypes.array.isRequired,
  playAnimation: PropTypes.bool.isRequired,
  handleAnimationEnded: PropTypes.func.isRequired,
};

export default AnimatedText;
