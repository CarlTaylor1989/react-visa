import React from 'react';
import { I18n, Translate } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import ResourceIcon from './resources/ResourceIcon';

import './ResourceButton.scss';

const ResourceButton = ({
  client,
  id,
  handleClick
}) => {
  const resourceId = I18n.t(`clientprops.clients.${client}.resources.${id}.id`);
  const type = I18n.t(`clientprops.clients.${client}.resources.${id}.type`);

  return (
    <button
      type="button"
      className="resourceButton"
      onClick={() => handleClick(resourceId, type)}
    >
      <ResourceIcon type={type} />
      <div className="resourceInfo">
        <Translate
          className="resourceName"
          value={`clientprops.clients.${client}.resources.${id}.name`}
        />
      </div>
    </button>
  );
};

ResourceButton.propTypes = {
  client: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default ResourceButton;
