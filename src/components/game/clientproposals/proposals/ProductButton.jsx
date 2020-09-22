import React from 'react';
import { I18n, Translate } from 'react-redux-i18n';
import PropTypes from 'prop-types';

import './ProductButton.scss';

const ProductButton = ({
  client,
  disabled,
  isSelected,
  id,
  productId,
  onProductChange,
  onLearnMore
}) => {
  const familyId = I18n.t(`clientprops.clients.${client}.products.${id}.familyId`);
  const selectedClass = isSelected ? ' selected' : '';
  const extraClasses = disabled ? ` disabled${selectedClass}` : selectedClass;

  return (
    <div className={`productButton${extraClasses}`}>
      <button
        type="button"
        className={`productButtonWrap ${familyId}`}
        disabled={disabled}
        onClick={() => onProductChange(productId)}
      >
        <div className="productInfo">
          <div className="productTitles">
            <Translate
              className="productFamily"
              value={`clientprops.clients.${client}.products.${id}.familyName`}
            />
            <Translate
              className="productName"
              value={`clientprops.clients.${client}.products.${id}.productName`}
            />
          </div>
        </div>
      </button>
      {onLearnMore && onLearnMore !== null && (
        <button
          className="productLearnCta"
          disabled={disabled}
          onClick={() => onLearnMore(id)}
          type="button"
        >
          <Translate
            className="text"
            value="clientprops.solutionsSet.solutionsLearnBtn"
          />
          <span className="arrowRight" />
        </button>
      )}
    </div>
  );
};

ProductButton.defaultProps = {
  disabled: false,
  onLearnMore: null,
  onProductChange: null
};

ProductButton.propTypes = {
  client: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  isSelected: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  onProductChange: PropTypes.func,
  onLearnMore: PropTypes.func
};

export default ProductButton;
