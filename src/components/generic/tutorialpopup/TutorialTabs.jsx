import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import _ from 'lodash';
import TutorialTab from './TutorialTab';

import './TutorialTabs.scss';

const TutorialTabs = ({ setSlideIndex, slideIndex }) => {
  let slides = I18n.t('generic.tutorial.slides');
  slides = _.keys(slides).map(value => slides[value]);

  const buttons = _.keys(I18n.t('generic.tutorial.tabs')).map((value, index) => {
    const section = I18n.t(`generic.tutorial.tabs.${value}.section`);
    const firstIndex = _.findIndex(slides, obj => obj.section === section);
    const lastIndex = _.findLastIndex(slides, obj => obj.section === section);

    return (
      <TutorialTab
        key={`tcc${index.toString()}`}
        label={I18n.t(`generic.tutorial.tabs.${value}.label`)}
        onTabSelect={setSlideIndex}
        sectionIndices={[firstIndex, lastIndex]}
        slideIndex={slideIndex}
      />
    );
  });

  return (
    <div className="tutorialTabs">{buttons}</div>
  );
};


TutorialTabs.propTypes = {
  setSlideIndex: PropTypes.func.isRequired,
  slideIndex: PropTypes.number.isRequired
};

export default TutorialTabs;
