import React from 'react';
import PropTypes from 'prop-types';

import './ResourceIcon.scss';

const ResourceIcon = ({ type }) => <span className={`resourceIcon ${type}`} />;

ResourceIcon.propTypes = {
  type: PropTypes.string.isRequired
};

export default ResourceIcon;
