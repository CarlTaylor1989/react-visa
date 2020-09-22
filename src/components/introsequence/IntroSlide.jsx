import React from 'react';
import PropTypes from 'prop-types';

import './IntroSlide.scss';

const IntroSlide = (props) => {
  const { title, text } = props;

  return (
    <div className="introSlide">
      <div
        className="title"
        dangerouslySetInnerHTML={{ __html: title }} // eslint-disable-line react/no-danger
      />
      <div
        className="text"
        dangerouslySetInnerHTML={{ __html: text }} // eslint-disable-line react/no-danger
      />
    </div>
  );
};

IntroSlide.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

export default IntroSlide;
