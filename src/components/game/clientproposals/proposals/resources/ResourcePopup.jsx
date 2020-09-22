import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import ScrollBar from 'react-scrollbars-custom';
import scrollBarSettings from '../../../../../config/scrollBar';
import ResourceIcon from './ResourceIcon';
import './ResourcePopup.scss';
import ResouceContent from './ResourceContent';

const ResourcePopup = ({
  showPopup,
  client,
  closePopup,
  resourceId,
  type,
  resources
}) => {
  const [resourceIndex] = Object.keys(resources).filter(
    r => `res${parseInt(r, 10) + 1}` === resourceId
  );

  const resource = resources[resourceIndex];
  const extraClasses = showPopup ? ' available' : '';

  return (
    <div className={`resourcePopup${extraClasses}`}>
      <div className="popupWrapper">
        <div className="buttons">
          <ResourceIcon type={type} />
          <button
            type="button"
            className="exitPopup"
            onClick={closePopup}
          >
            <Translate value="generic.popupCloseBtn" />
          </button>
        </div>
        <div className="scrollingArea">
          <ScrollBar {...scrollBarSettings}>
            <ResouceContent
              client={client}
              resource={resource}
              resourceIndex={resourceIndex}
              type={type}
            />
          </ScrollBar>
        </div>
      </div>
    </div>
  );
};

ResourcePopup.propTypes = {
  client: PropTypes.string.isRequired,
  closePopup: PropTypes.func.isRequired,
  showPopup: PropTypes.bool.isRequired,
  resourceId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  resources: PropTypes.object.isRequired
};

export default ResourcePopup;
