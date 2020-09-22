import React from 'react';
import PropTypes from 'prop-types';
import productData from '../../../../translations/en_us/network/maps/map1/products/index';
import ProductRow from './ProductRow';

import './FamilyProducts.scss';

const FamilyProducts = (props) => {
  const {
    closePopup,
    familyId,
    familyName,
    mapId,
    type
  } = props;

  const productRows = productData[familyId].map(data => (
    <ProductRow
      key={`${familyId}${data.id}`}
      closePopup={closePopup}
      familyId={familyId}
      mapId={mapId}
      productId={data.id}
      productName={data.nameCoord.name}
      type={type}
    />
  ));

  return (
    <div className="familyProducts">
      <div
        className={`familyName ${type}`}
        dangerouslySetInnerHTML={{ __html: familyName }} // eslint-disable-line react/no-danger
      />
      <div className={`productsContainer ${type}`}>
        {productRows}
      </div>
    </div>
  );
};

FamilyProducts.propTypes = {
  closePopup: PropTypes.func.isRequired,
  familyId: PropTypes.string.isRequired,
  familyName: PropTypes.string.isRequired,
  mapId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default FamilyProducts;
