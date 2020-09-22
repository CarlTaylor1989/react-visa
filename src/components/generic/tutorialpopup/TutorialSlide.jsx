import React from 'react';
import PropTypes from 'prop-types';

import './TutorialSlide.scss';

const TutorialSlide = ({ imageSrc, title, text }) => {
  const imgUrl = require(`../../../resources/tutorials/${imageSrc}`); // eslint-disable-line
  return (
    <div className="tutorialSlide">
      <div>
        <img
          className="slideImg"
          src={imgUrl}
          alt=""
        />
      </div>
      <div className="contentArea">
        {title && (
          <div
            className="title"
            dangerouslySetInnerHTML={{ __html: title }} // eslint-disable-line react/no-danger
          />
        )}
        {text && (
          <div
            className="text"
            dangerouslySetInnerHTML={{ __html: text }} // eslint-disable-line react/no-danger
          />
        )}
      </div>
    </div>
  );
};

TutorialSlide.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

export default TutorialSlide;
