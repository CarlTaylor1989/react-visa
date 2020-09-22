import React from 'react';
import PropTypes from 'prop-types';
import InlineSVG from 'svg-inline-react';

const ResourceInlineSVG = ({ client, imageName, type }) => {
  const svg = require(`../../../../../resources/clients/${client}/${imageName}`); // eslint-disable-line
  return (
    <InlineSVG className={type} src={svg} />
  );
};

ResourceInlineSVG.propTypes = {
  client: PropTypes.string.isRequired,
  imageName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default ResourceInlineSVG;
