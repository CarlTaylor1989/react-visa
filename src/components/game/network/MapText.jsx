import React from 'react';
import PropTypes from 'prop-types';

import './MapText.scss';

const MapText = (props) => {
  const { nameCoord, type } = props;
  const styles = {
    left: nameCoord.coordinates[0],
    top: nameCoord.coordinates[1]
  };
  return (
    <span
      dangerouslySetInnerHTML={{ __html: nameCoord.name }} // eslint-disable-line react/no-danger
      style={styles}
      className={`mapText ${type}`}
    />
  );
};

MapText.propTypes = {
  nameCoord: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
};

export default MapText;
