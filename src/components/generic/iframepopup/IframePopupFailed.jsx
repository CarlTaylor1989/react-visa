import React from 'react';
import { Translate } from 'react-redux-i18n';

import './IframePopupFailed.scss';

const IframePopupFailed = () => (
  <div className="iframePopupFailed">
    <span className="icon" />
    <div className="errorBody">
      <Translate className="errorTitle" value="generic.iframePopup.errorTitle" />
      <Translate className="errorText" value="generic.iframePopup.errorText" />
    </div>
  </div>
);

export default IframePopupFailed;
