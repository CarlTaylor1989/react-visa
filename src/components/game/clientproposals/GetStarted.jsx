import React from 'react';
import { Translate } from 'react-redux-i18n';
import Arrows from '../../generic/arrows/Arrows';

import './GetStarted.scss';

const GetStarted = () => (
  <div className="getStarted">
    <span className="guide" />
    <Translate className="instructionText" value="clientprops.getStarted" />
    <Arrows />
  </div>
);

export default GetStarted;
