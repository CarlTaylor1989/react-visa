import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import InlineSVG from 'svg-inline-react';
import ProductComletion from './ProductCompletion';
import ActionCreators from '../../../../actions/index';
import { networkProductPath } from '../../../../config/navigation';
import { dashboardReferrer } from '../../../../config/referrers';

import './ProductRow.scss';

export class ProductRow extends Component {
  constructor(props) {
    super(props);
    this.onProductRowClick = this.onProductRowClick.bind(this);
  }

  onProductRowClick() {
    const {
      closePopup,
      familyId,
      mapId,
      productId,
      setCurrentFamilyProduct,
      setScreenReferrer
    } = this.props;

    setScreenReferrer(dashboardReferrer);
    setCurrentFamilyProduct(mapId, familyId, productId);
    closePopup();
  }

  render() {
    const {
      completedProducts,
      familyId,
      mapId,
      productId,
      productName,
      type
    } = this.props;

    const svg = require(`../../../../resources/${mapId}/${familyId}/products/${productId}.svg`); // eslint-disable-line
    const completed = completedProducts.includes(familyId + productId);

    return (
      <NavLink
        to={networkProductPath}
        className={`productRow ${type} ${completed ? 'completed' : ''}`}
        onClick={this.onProductRowClick}
      >
        <InlineSVG className="productRowIcon" src={svg} />
        <div
          className="productName"
          dangerouslySetInnerHTML={{ __html: productName }} // eslint-disable-line react/no-danger
        />
        <ProductComletion familyId={familyId} productId={productId} />
      </NavLink>
    );
  }
}

ProductRow.propTypes = {
  closePopup: PropTypes.func.isRequired,
  completedProducts: PropTypes.array.isRequired,
  familyId: PropTypes.string.isRequired,
  mapId: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  setCurrentFamilyProduct: PropTypes.func.isRequired,
  setScreenReferrer: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};

export const mapStateToProps = state => ({
  completedProducts: state.mapData.completedProducts
});

export const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductRow);
