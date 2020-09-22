import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import ScrollBar from 'react-scrollbars-custom';
import scrollBarSettings from '../../../config/scrollBar';
import FamilyProducts from './productsview/FamilyProducts';
import { sendInteractionData } from '../../../tracking/xapi/XApiAdapter';
import familyData from '../../../translations/en_us/network/maps/map1/families.json';

import './ProductsCompleteView.scss';

class ProductsCompleteView extends Component {
  constructor(props) {
    super(props);
    this.timeAvailable = null;
  }

  componentDidMount() {
    this.timeAvailable = new Date();
  }

  componentWillUnmount() {
    sendInteractionData({
      type: 'experienced',
      activity: {
        id: 'dashboard/products',
        type: 'slide',
        title: I18n.t('xapi.dashboard.productsTitle'),
        description: I18n.t('xapi.dashboard.productsDescription')
      },
      response: {
        timeAvailable: this.timeAvailable,
        timeResponse: new Date()
      },
      parent: 'dashboard'
    });
  }

  render() {
    const { closePopup } = this.props;
    const families = _.keys(familyData).map((familyId, index) => (
      <FamilyProducts
        key={`${familyId}${index.toString()}`}
        familyId={familyId}
        familyName={familyData[familyId].nameCoord.name}
        mapId={familyData[familyId].mapId}
        type={familyData[familyId].type}
        closePopup={closePopup}
      />
    ));

    return (
      <div className="productsCompleteView">
        <ScrollBar {...scrollBarSettings}>
          <div className="contentWrapper">
            {families}
          </div>
        </ScrollBar>
      </div>
    );
  }
}

ProductsCompleteView.propTypes = {
  closePopup: PropTypes.func.isRequired
};

export default ProductsCompleteView;
