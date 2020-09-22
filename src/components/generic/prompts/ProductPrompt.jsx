
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { Translate } from 'react-redux-i18n';
import InlineSVG from 'svg-inline-react';
import familyData from '../../../translations/en_us/network/maps/map1/families.json';
import products from '../../../translations/en_us/network/maps/map1/products/index';
import { PRODUCT_COMPLETED } from '../../../config/scores';

import './ProductPrompt.scss';

class ProductPrompt extends Component {
  componentDidMount() {
    const { setPlayAudio } = this.props;
    setPlayAudio('au4');
  }

  render() {
    const {
      productId,
      familyId,
      mapId
    } = this.props;
    const family = familyData[familyId];
    const productData = products[familyId].find(prod => prod.id === productId);
    const svg = require(`../../../resources/${mapId}/${familyId}/products/${productId}.svg`); // eslint-disable-line

    return (
      <div className={`productPrompt ${family.type}`}>
        <Translate className="popupTitle" value="generic.prompts.productTitle" />
        <div className="productPromptFamilyContainer">
          <div className="productPromptFamily">
            <span
              dangerouslySetInnerHTML={{ __html: family.nameCoord.name }} // eslint-disable-line react/no-danger
            />
          </div>
          <InlineSVG className="icon productPromptIcon" src={svg} />
          <div className="productPromptTitle">
            <span
              dangerouslySetInnerHTML={{ __html: productData.nameCoord.name }} // eslint-disable-line react/no-danger
            />
          </div>
        </div>
        <div className="productPromptScore">
          <Translate value="generic.prompts.pointsPrefix" />
          <NumberFormat
            value={PRODUCT_COMPLETED}
            displayType="text"
            thousandSeparator=","
          />
        </div>
      </div>
    );
  }
}

ProductPrompt.propTypes = {
  familyId: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  mapId: PropTypes.string.isRequired,
  setPlayAudio: PropTypes.func.isRequired
};

export default ProductPrompt;
